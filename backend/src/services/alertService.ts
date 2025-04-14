import { Alert } from '../models/Alert';
import * as alertRepository from '../repositories/alertRepository';
import { getCurrentWeather } from './weatherService';
import { extractLocation } from '../utils/locationUtils';
import { evaluateCondition, getParameterValue } from '../utils/conditionEvaluator';
import { validateAlertData } from '../validators/alertValidator';

// Return type for the checkAlertCondition function
export interface AlertConditionResult {
  isTriggered: boolean;
  currentValue: number;
  locationValid: boolean;
  error?: string;
  resolvedLocation?: string;
}

/**
 * Get the parameter value from weather data for an alert
 */
const getWeatherParameterValue = async (alert: Alert): Promise<{ value: number, resolvedLocation: string }> => {
  const location = extractLocation(alert);
  const weather = await getCurrentWeather(location);
  
  return { 
    value: getParameterValue(weather, alert.parameter),
    resolvedLocation: weather.location 
  };
};

/**
 * Check if an alert condition is currently triggered
 */
export const checkAlertCondition = async (alert: Partial<Alert>): Promise<AlertConditionResult> => {
  try {
    const { value: parameterValue, resolvedLocation } = await getWeatherParameterValue(alert as Alert);
    return {
      isTriggered: evaluateCondition(parameterValue, alert as Alert),
      currentValue: parameterValue,
      locationValid: true,
      resolvedLocation
    };
  } catch (error) {
    console.error('Error checking alert condition:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      isTriggered: false,
      currentValue: 0,
      locationValid: false,
      error: errorMessage
    };
  }
};

/**
 * Evaluate an alert and update its status in the database if needed
 */
export const evaluateAlert = async (alert: Alert): Promise<boolean> => {
  try {
    const result = await checkAlertCondition(alert);
    
    // If we couldn't validate the location, don't change the triggered state
    if (!result.locationValid) {
      console.error(`Could not evaluate alert ${alert.id}: ${result.error}`);
      return alert.isTriggered; // Keep previous state
    }
    
    const isTriggered = result.isTriggered;
    
    // Update alert in database if triggered status has changed
    if (isTriggered !== alert.isTriggered) {
      await alertRepository.updateAlert(alert.id, { 
        isTriggered,
        lastChecked: new Date(),
        lastValue: result.currentValue
      });
    }

    return isTriggered;
  } catch (error) {
    console.error('Error evaluating alert:', error);
    return alert.isTriggered; // Keep previous state on error
  }
};

/**
 * Create a validation error
 */
const createValidationError = (message?: string): Error => {
  const error = new Error(message || 'Invalid alert data');
  error.name = 'ValidationError';
  return error;
};

/**
 * Create a location error
 */
const createLocationError = (locationName: string, details?: string): Error => {
  let errorMsg;
  
  // Check if this is a rate limit error
  if (details && details.includes("API rate limit exceeded")) {
    errorMsg = `API rate limit exceeded. Please try again later.`;
  } else {
    errorMsg = `Invalid location: "${locationName || 'Unknown'}". ${details || 'Could not fetch weather data'}. Please provide a valid city name or try removing commas (e.g. "New York" instead of "New York, NY").`;
  }
  
  const error = new Error(errorMsg);
  error.name = 'LocationError';
  return error;
};

/**
 * Validate location by checking alert condition
 * @throws LocationError if location is invalid
 */
const validateLocation = async (alert: Partial<Alert>): Promise<AlertConditionResult> => {
  try {
    const alertCheck = await checkAlertCondition(alert);
    
    if (!alertCheck.locationValid) {
      const locationName = alert.location?.city || 'Unknown';
      throw createLocationError(locationName, alertCheck.error);
    }
    
    return alertCheck;
  } catch (error: any) {
    // Re-throw LocationError, but convert other errors to LocationError
    if (error.name === 'LocationError') throw error;
    
    const locationError = new Error(`Failed to check location: ${error.message || String(error)}`);
    locationError.name = 'LocationError';
    throw locationError;
  }
};

/**
 * Update an alert with validation
 * This function centralizes all validation and checks in the service layer
 * @throws Error with name 'ValidationError' if validation fails
 * @throws Error with name 'LocationError' if location check fails
 */
export const updateAlertWithValidation = async (
  id: string, 
  updateData: Partial<Alert>
): Promise<Alert | null> => {
  // Get existing alert
  const existingAlert = await alertRepository.getAlertById(id);
  if (!existingAlert) return null;
  
  // If updating location, verify it exists with an alert check
  if (updateData.location) {
    const newAlert = { ...existingAlert, ...updateData };
    const alertCheck = await validateLocation(newAlert);
    
    // Update the resolved location
    updateData.resolvedLocation = alertCheck.resolvedLocation;
  }
  
  // If updating critical fields, validate them
  if (updateData.location || updateData.parameter || 
      updateData.threshold !== undefined || updateData.condition) {
    
    const validation = validateAlertData({
      ...existingAlert,
      ...updateData
    });
    
    if (!validation.valid) {
      throw createValidationError(validation.error);
    }
  }
  
  // Everything validated, update the alert
  return alertRepository.updateAlert(id, updateData);
};

/**
 * Create a new alert with validation
 * This function handles validation, location checks, and alert creation
 * @throws Error with name 'ValidationError' if validation fails
 * @throws Error with name 'LocationError' if location check fails
 */
export const createAlertWithValidation = async (
  alertData: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Alert> => {
  // Validate the alert data structure
  const validation = validateAlertData(alertData);
  if (!validation.valid) {
    throw createValidationError(validation.error);
  }
  
  // Check if the alert condition is currently met and validate location
  const alertCheck = await validateLocation({
    ...alertData,
    lastChecked: new Date()
  });
  
  // Create alert with the correct triggered state
  const newAlert = {
    ...alertData,
    isTriggered: alertCheck.isTriggered,
    lastChecked: new Date(),
    resolvedLocation: alertCheck.resolvedLocation,
    lastValue: alertCheck.currentValue
  };
  
  // Create the alert in the database
  return alertRepository.createAlert(newAlert);
};

/**
 * Evaluate an alert by ID and update its status in the database
 * @returns Details about the evaluation result, or null if alert not found
 */
export const evaluateAlertById = async (id: string): Promise<{
  id: string;
  name: string;
  isTriggered: boolean;
  lastChecked: Date;
  lastValue?: number;
} | null> => {
  // Get the alert by ID
  const alert = await alertRepository.getAlertById(id);
  if (!alert) return null;

  // Evaluate the alert
  const result = await checkAlertCondition(alert);
  const isTriggered = result.isTriggered;
  
  // Update in database
  await alertRepository.updateAlert(alert.id, { 
    isTriggered, 
    lastChecked: new Date(),
    lastValue: result.currentValue
  });
  
  // Return details about the evaluation
  return {
    id: alert.id,
    name: alert.name,
    isTriggered,
    lastChecked: new Date(),
    lastValue: result.currentValue
  };
}; 