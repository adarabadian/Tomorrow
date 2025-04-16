import cron from 'node-cron';
import { Alert } from '../models/Alert';
import * as alertRepository from '../repositories/alertRepository';
import { sendNotification } from './notificationService';
import { getCurrentWeather, WeatherData } from './weatherService';
import { extractLocation, formatLocationParam } from '../utils/locationUtils';
import { evaluateCondition, getParameterValue } from '../utils/conditionEvaluator';
import { logError } from '../utils/errorHandlers';

/**
 * Group alerts by location to minimize API calls
 */
const groupByLocation = (alerts: Alert[]): Map<string, Alert[]> => {
  const groups = new Map<string, Alert[]>();
  
  for (const alert of alerts) {
    try {
      // First check if we have a resolved location from previous API calls
      if (alert.resolvedLocation) {
        // Use the resolved location as the key
        const locationKey = alert.resolvedLocation;
        
        if (!groups.has(locationKey)) groups.set(locationKey, []);
        groups.get(locationKey)!.push(alert);
      } else {
        // Fall back to extracting from user input if no resolved location exists
        const location = extractLocation(alert);
        const locationKey = formatLocationParam(location);

        if (!groups.has(locationKey)) groups.set(locationKey, []);
        groups.get(locationKey)!.push(alert);
      }
    } catch (error) {
      logError.alert(alert.id, error);
    }
  }
  
  return groups;
};

/**
 * Process a single alert with weather data
 */
const processAlert = async (alert: Alert, weather: WeatherData): Promise<boolean> => {
  try {
    const paramName = alert.parameter;
    
    // Check if parameter exists in weather data
    if (!(paramName in weather)) {
      console.error(`Parameter ${paramName} not found in weather data for alert ${alert.id}`);
      return false;
    }
    
    const currentValue = getParameterValue(weather, paramName);
    const wasTriggered = alert.isTriggered;
    const isTriggered = evaluateCondition(currentValue, alert);
    
    // Always update the lastValue and save the standardized location name
    await updateAlertStatus(alert.id, isTriggered, currentValue, weather.location);
    
    // Send notification only if newly triggered
    if (isTriggered && !wasTriggered) {
      await sendNotification(alert, currentValue);
    }
    
    return true;
  } catch (error) {
    logError.alert(alert.id, error);
    return false;
  }
};

/**
 * Update an alert's status in the database
 */
const updateAlertStatus = async (alertId: string, isTriggered: boolean, currentValue: number, standardizedLocation: string): Promise<void> => {
  await alertRepository.updateAlert(alertId, {
    isTriggered,
    lastChecked: new Date(),
    lastValue: currentValue,
    resolvedLocation: standardizedLocation
  });
};

/**
 * Prepare location requests from grouped alerts
 */
const prepareLocationRequests = (locationGroups: Map<string, Alert[]>) => {
  const requests = [];
  
  for (const [key, alerts] of locationGroups.entries()) {
    if (alerts.length === 0) continue;
    
    try {
      const location = extractLocation(alerts[0]);
      requests.push({ key, location, alerts });
    } catch (error) {
      logError.location(key, error);
    }
  }
  
  return requests;
};

/**
 * Fetch weather data for all locations in parallel
 */
const fetchWeatherData = async (requests: any[]) => {
  const weatherPromises = requests.map(req => fetchWeatherForLocation(req));
  const results = await Promise.all(weatherPromises);
  return results.filter(r => r.success && r.weather);
};

/**
 * Fetch weather data for a single location
 */
const fetchWeatherForLocation = async (req: any) => {
  try {
    const weather = await getCurrentWeather(req.location);
    
    // Update fetch status as success and store standardized location
    await alertRepository.updateLocationFetchStatus(req.key, {
      success: true
    });
    
    // If you want to update the location separately:
    if (weather.location) {
      await alertRepository.updateResolvedLocation(req.key, weather.location);
    }
    
    return { ...req, weather, success: true };
  } catch (error) {
    // Log the error with more details
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to fetch weather for location ${req.key}: ${errorMessage}`);
    logError.location(req.key, error);
    
    // Update fetch status as failed
    await alertRepository.updateLocationFetchStatus(req.key, { success: false });
    
    return { ...req, success: false, errorMessage };
  }
};

/**
 * Process all alerts with their respective weather data
 */
const processAllAlerts = async (successfulResults: any[]) => {
  // Create all alert processing tasks
  const tasks = [];
  
  for (const result of successfulResults) {
    console.log(`Processing ${result.alerts.length} alerts for location: ${result.key}`);
    
    for (const alert of result.alerts) {
      tasks.push(processAlert(alert, result.weather));
    }
  }
  
  // Run all tasks in parallel
  return await Promise.all(tasks);
};

/**
 * Log alert evaluation summary
 */
const logEvaluationSummary = (locationRequests: any[], successfulRequests: any[], alertResults: boolean[]) => {
  // Log any failures
  const failedCount = locationRequests.length - successfulRequests.length;
  if (failedCount > 0) console.error(`Failed to fetch weather data for ${failedCount} locations`);
  
  // Summarize results
  const totalProcessed = alertResults.length;
  const successfulAlerts = alertResults.filter(Boolean).length;
  const failedAlerts = totalProcessed - successfulAlerts;
  
  console.log(`Alert evaluation completed: ${successfulAlerts} alerts processed successfully, ${failedAlerts} failed`);
};

/**
 * Fetch all alerts and prepare them for evaluation
 * @returns Prepared location requests or undefined if no alerts
 */
const prepareAlerts = async (): Promise<any[] | undefined> => {
  // Get all alerts
  const alerts = await alertRepository.getAlerts();
  console.log(`Evaluating ${alerts.length} alerts`);
  if (alerts.length === 0) return undefined;
  
  // Group alerts by location
  const locationGroups = groupByLocation(alerts);
  console.log(`Grouped into ${locationGroups.size} locations`);
  
  // Prepare location requests
  const locationRequests = prepareLocationRequests(locationGroups);
  if (locationRequests.length === 0) return undefined;
  
  return locationRequests;
};

/**
 * Process alerts with weather data
 * @returns Results of alert processing and successful requests
 */
const processAlerts = async (locationRequests: any[]): Promise<{
  results: boolean[],
  successfulRequests: any[]
}> => {
  // Fetch weather data in parallel
  console.log(`Fetching weather data for ${locationRequests.length} locations in parallel`);
  const successfulRequests = await fetchWeatherData(locationRequests);
  
  // Process all alerts in parallel
  const results = await processAllAlerts(successfulRequests);
  
  return { results, successfulRequests };
};

/**
 * Main evaluation function
 */
const runEvaluation = async (): Promise<void> => {
  try {
    // Prepare alerts
    const locationRequests = await prepareAlerts();
    if (!locationRequests) return;
    
    // Process alerts
    const { results: alertResults, successfulRequests } = await processAlerts(locationRequests);
    
    // Log summary
    logEvaluationSummary(locationRequests, successfulRequests, alertResults);
  } catch (error) {
    console.error('Error in alert evaluation:', error);
  }
};

/**
 * Start the scheduled evaluation service & run evaluation immediately
 */
export const startAlertEvaluationService = (): void => {
  console.log('Starting alert evaluation service (every 10 minutes)');
  runEvaluation();
  cron.schedule('*/10 * * * *', runEvaluation);
}; 