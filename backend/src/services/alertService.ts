import { Alert } from '../models/Alert';
import * as alertRepository from '../repositories/alertRepository';
import { getCurrentWeather } from './weatherService';
import { extractLocation } from '../utils/locationUtils';


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

const getParameterValue = async (alert: Alert): Promise<number> => {
  const location = extractLocation(alert);
  const weather = await getCurrentWeather(location);
  
  // Get the parameter value
  const currentValue = Number(weather[alert.parameter as keyof typeof weather]);
  if (isNaN(currentValue)) throw new Error(`Invalid weather parameter: ${alert.parameter}`);
  
  return currentValue;
};

export const checkAlertCondition = async (alert: Partial<Alert>): Promise<boolean> => {
  try {
    const parameterValue = await getParameterValue(alert as Alert);
    return evaluateCondition(parameterValue, alert as Alert);
  } catch (error) {
    console.error('Error checking alert condition:', error);
    return false;
  }
};

export const evaluateAlert = async (alert: Alert): Promise<boolean> => {
  try {
    const parameterValue = await getParameterValue(alert);
    const isTriggered = evaluateCondition(parameterValue, alert);
    
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