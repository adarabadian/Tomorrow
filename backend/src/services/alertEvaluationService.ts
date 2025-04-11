import cron from 'node-cron';
import { Alert } from '../models/Alert';
import * as alertRepository from '../repositories/alertRepository';
import { sendNotification } from './notificationService';
import { getCurrentWeather, WeatherData } from './weatherService';
import { extractLocation, formatLocationParam, Location } from '../utils/locationUtils';

// Evaluate if an alert condition is met
const evaluateCondition = (value: number, alert: Alert): boolean => {
  switch (alert.condition) {
    case '>': return value > alert.threshold;
    case '<': return value < alert.threshold;
    case '>=': return value >= alert.threshold;
    case '<=': return value <= alert.threshold;
    case '==': return value === alert.threshold;
    default: return false;
  }
};

// Error handler functions
const logError = {
  alert: (alertId: string, error: any): void => {
    const message = error.message || 'Unknown error';
    console.error(`Error processing alert ${alertId}: ${message}`);
  },
  
  location: (locationKey: string, error: any): void => {
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      console.error(`Timeout error for location ${locationKey}: ${error.message}`);
    } else if (error.message?.includes('API key')) {
      console.error(`API key error for location ${locationKey}: ${error.message}`);
    } else {
      console.error(`Error processing location ${locationKey}:`, error);
    }
  }
};

// Group alerts by location
const groupByLocation = (alerts: Alert[]): Map<string, Alert[]> => {
  const groups = new Map<string, Alert[]>();
  
  for (const alert of alerts) {
    try {
      const location = extractLocation(alert);
      const locationKey = formatLocationParam(location);
      
      if (!groups.has(locationKey)) {
        groups.set(locationKey, []);
      }
      
      groups.get(locationKey)!.push(alert);
    } catch (error) {
      logError.alert(alert.id, error);
    }
  }
  
  return groups;
};

// Process a single alert with weather data
const processAlert = async (alert: Alert, weather: WeatherData): Promise<boolean> => {
  try {
    const paramName = alert.parameter;
    if (!(paramName in weather)) {
      console.error(`Parameter ${paramName} not found in weather data for alert ${alert.id}`);
      return false;
    }
    
    const weatherValue = weather[paramName as keyof typeof weather];
    const currentValue = typeof weatherValue === 'number' ? weatherValue : 0;
    const wasTriggered = alert.isTriggered;
    const isTriggered = evaluateCondition(currentValue, alert);
    
    // Only update if the state has changed
    if (isTriggered !== wasTriggered) {
      await alertRepository.updateAlert(alert.id, {
        isTriggered,
        lastChecked: new Date()
      });
      
      // Send notification if newly triggered
      if (isTriggered && !wasTriggered) await sendNotification(alert, currentValue);
    }
    
    return true;
  } catch (error) {
    logError.alert(alert.id, error);
    return false;
  }
};

// Prepare location requests from grouped alerts
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

// Fetch weather data for all locations in parallel
const fetchWeatherData = async (requests: any[]) => {
  const weatherPromises = requests.map(async (req) => {
    try {
      const weather = await getCurrentWeather(req.location);
      return { ...req, weather, success: true };
    } catch (error) {
      logError.location(req.key, error);
      return { ...req, success: false };
    }
  });
  
  const results = await Promise.all(weatherPromises);
  return results.filter(r => r.success && r.weather);
};

// Process all alerts with their respective weather data
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

// Main evaluation function
const runEvaluation = async (): Promise<void> => {
  try {
    // Get all alerts
    const alerts = await alertRepository.getAlerts();
    console.log(`Evaluating ${alerts.length} alerts`);
    if (alerts.length === 0) return;
    
    // Group alerts by location
    const locationGroups = groupByLocation(alerts);
    console.log(`Grouped into ${locationGroups.size} locations`);
    
    // Prepare location requests
    const locationRequests = prepareLocationRequests(locationGroups);
    if (locationRequests.length === 0) return;
    
    // Fetch weather data in parallel
    console.log(`Fetching weather data for ${locationRequests.length} locations in parallel`);
    const successfulRequests = await fetchWeatherData(locationRequests);
    
    // Log any failures
    const failedCount = locationRequests.length - successfulRequests.length;
    if (failedCount > 0) {
      console.error(`Failed to fetch weather data for ${failedCount} locations`);
    }
    
    // Process all alerts in parallel
    const alertResults = await processAllAlerts(successfulRequests);
    
    // Summarize results
    const totalProcessed = alertResults.length;
    const successfulAlerts = alertResults.filter(Boolean).length;
    const failedAlerts = totalProcessed - successfulAlerts;
    
    console.log(`Alert evaluation completed: ${successfulAlerts} alerts processed successfully, ${failedAlerts} failed`);
  } catch (error) {
    console.error('Error in alert evaluation:', error);
  }
};

// Start the scheduled evaluation service & run evaluation immediately
export const startAlertEvaluationService = (): void => {
  console.log('Starting alert evaluation service (every 5 minutes)');
  runEvaluation();
  cron.schedule('*/5 * * * *', runEvaluation);
}; 