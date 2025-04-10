import cron from 'node-cron';
import { Alert } from '../models/Alert';
import * as alertRepository from '../repositories/alertRepository';
import { sendNotification } from './notificationService';
import { getCurrentWeather } from './weatherService';
import { extractLocation, formatLocationParam } from '../utils/locationUtils';

// Cache for locations - refreshed each evaluation cycle
const locationCache = new Map<string, Alert[]>();

/**
 * Evaluates an alert condition against a value
 */
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

/**
 * Handle alert processing errors
 */
const handleAlertProcessingError = (alertId: string, error: any): void => {
  if (error.message) {
    console.error(`Error processing alert ${alertId}: ${error.message}`);
  } else {
    console.error(`Unknown error processing alert ${alertId}:`, error);
  }
};

/**
 * Handle location group processing errors
 */
const handleLocationError = (locationKey: string, error: any): void => {
  if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
    console.error(`Timeout error for location ${locationKey}: ${error.message}`);
  } else if (error.message && error.message.includes('API key')) {
    console.error(`API key error for location ${locationKey}: ${error.message}`);
  } else {
    console.error(`Error processing location ${locationKey}:`, error);
  }
};

/**
 * Get location key for an alert
 */
const getLocationKey = (alert: Alert): string => {
  try {
    const location = extractLocation(alert);
    return formatLocationParam(location);
  } catch (error) {
    console.error(`Error getting location key for alert ${alert.id}:`, error);
    return '';
  }
};

/**
 * Group alerts by location to minimize API calls
 * Uses cached location groups when possible
 */
const groupByLocation = (alerts: Alert[]): Map<string, Alert[]> => {
  // Clear cache and rebuild
  locationCache.clear();
  
  for (const alert of alerts) {
    const locationKey = getLocationKey(alert);
    if (!locationKey) continue;
    
    if (!locationCache.has(locationKey)) {
      locationCache.set(locationKey, []);
    }
    
    locationCache.get(locationKey)!.push(alert);
  }
  
  return locationCache;
};

/**
 * Process a single alert with the weather data
 */
const processAlert = async (alert: Alert, weather: any): Promise<void> => {
  try {
    const paramName = alert.parameter;
    if (!(paramName in weather)) {
      console.error(`Parameter ${paramName} not found in weather data for alert ${alert.id}`);
      return;
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
      
      // Send notification if newly triggered - always pass currentValue
      if (isTriggered && !wasTriggered) {
        await sendNotification(alert, currentValue);
      }
    }
  } catch (error) {
    handleAlertProcessingError(alert.id, error);
  }
};

/**
 * Process alerts for a location
 */
const processLocationAlerts = async (locationKey: string, alerts: Alert[]): Promise<void> => {
  try {
    console.log(`Processing ${alerts.length} alerts for location: ${locationKey}`);

    // Get weather data once for this location
    const location = extractLocation(alerts[0]);
    const weather = await getCurrentWeather(location);

    // Process each alert with the same weather data
    for (const alert of alerts) {
      await processAlert(alert, weather);
    }
  } catch (error) {
    handleLocationError(locationKey, error);
  }
};

/**
 * Run alert evaluation process
 */
const runEvaluation = async (): Promise<void> => {
  try {
    // Get all alerts
    const alerts = await alertRepository.getAlerts();
    console.log(`Evaluating ${alerts.length} alerts`);
    
    if (alerts.length === 0) return;
    
    // Group by location using cached info when possible
    const locationGroups = groupByLocation(alerts);
    console.log(`Grouped into ${locationGroups.size} locations`);
    
    // Process each location group
    for (const [locationKey, locationAlerts] of locationGroups.entries()) {
      await processLocationAlerts(locationKey, locationAlerts);
    }
    
    console.log('Alert evaluation completed');
  } catch (error) {
    console.error('Error in alert evaluation:', error);
  }
};

/**
 * Start the scheduled evaluation service
 */
export const startAlertEvaluationService = (): void => {
  console.log('Starting alert evaluation service (every 5 minutes)');
  
  // Run immediately
  runEvaluation();
  
  // Schedule for every 5 minutes
  cron.schedule('*/5 * * * *', runEvaluation);
}; 