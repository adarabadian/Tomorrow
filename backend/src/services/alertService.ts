import { Alert } from '../models/Alert';
import * as alertRepository from '../repositories/alertRepository';
import { getCurrentWeather } from './weatherService';
import { extractLocation } from '../utils/locationUtils';

/**
 * Evaluate a condition based on alert parameters and a current value
 */
const evaluateCondition = (currentValue: number, alert: Alert): boolean => {
  switch (alert.condition) {
    case '>':
      return currentValue > alert.threshold;
    case '<':
      return currentValue < alert.threshold;
    case '>=':
      return currentValue >= alert.threshold;
    case '<=':
      return currentValue <= alert.threshold;
    case '==':
      return currentValue === alert.threshold;
    default:
      throw new Error(`Invalid condition: ${alert.condition}`);
  }
};

/**
 * Get the current parameter value from weather data
 */
const getParameterValue = async (alert: Alert): Promise<number> => {
  // Get location from alert
  const location = extractLocation(alert);
  
  // Fetch current weather data
  const weather = await getCurrentWeather(location);
  
  // Get the parameter value
  const currentValue = Number(weather[alert.parameter as keyof typeof weather]);
  if (isNaN(currentValue)) {
    throw new Error(`Invalid weather parameter: ${alert.parameter}`);
  }
  
  return currentValue;
};

/**
 * Evaluate an alert against current weather conditions
 */
export const evaluateAlert = async (alert: Alert): Promise<boolean> => {
  try {
    // Get the current parameter value
    const currentValue = await getParameterValue(alert);
    
    // Evaluate the condition
    const isTriggered = evaluateCondition(currentValue, alert);
    
    // Update alert in database if triggered status has changed
    if (isTriggered !== alert.isTriggered) {
      await alertRepository.updateAlert(alert.id, { 
        isTriggered,
        lastChecked: new Date()
      });
    }

    return isTriggered;
  } catch (error) {
    console.error('Error evaluating alert:', error);
    return false;
  }
}; 