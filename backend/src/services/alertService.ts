import { Alert } from '../models/Alert';
import * as alertRepository from '../repositories/alertRepository';
import { getCurrentWeather } from './weatherService';
import { extractLocation } from '../utils/locationUtils';
import { evaluateCondition, getParameterValue } from '../utils/conditionEvaluator';
import { validateAlertData } from '../validators/alertValidator';
import { createValidationError, createLocationError } from '../utils/errorHandlers';

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
 * Update alert in database if triggered status has changed
 */
const persistAlertStatusChange = async (alert: Alert, isTriggered: boolean, currentValue: number): Promise<void> => {
  if (isTriggered !== alert.isTriggered) {
    await alertRepository.updateAlert(alert.id, { 
      isTriggered,
      lastChecked: new Date(),
      lastValue: currentValue
    });
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
    await persistAlertStatusChange(alert, isTriggered, result.currentValue);

    return isTriggered;
  } catch (error) {
    console.error('Error evaluating alert:', error);
    return alert.isTriggered; // Keep previous state on error
  }
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
 * Validate alert data structure and conditions
 * @throws ValidationError if validation fails
 */
const validateAlertStructure = (alertData: Partial<Alert>): void => {
  const validation = validateAlertData(alertData);
  if (!validation.valid) throw createValidationError(validation.error);
};

/**
 * Check if update affects condition-related fields
 */
const isConditionUpdate = (updateData: Partial<Alert>): boolean => {
  return !!(updateData.location || 
            updateData.parameter || 
            updateData.threshold !== undefined || 
            updateData.condition);
};

/**
 * Update alert trigger state based on the latest condition check
 */
const updateAlertTriggerState = async (
  existingAlert: Alert, 
  updateData: Partial<Alert>
): Promise<void> => {
  const updatedAlert = { ...existingAlert, ...updateData };
  const result = await checkAlertCondition(updatedAlert);
  
  if (result.locationValid) {
    updateData.isTriggered = result.isTriggered;
    updateData.lastValue = result.currentValue;
    updateData.lastChecked = new Date();
  }
};

/**
 * Handle location validation and update resolved location
 */
const handleLocationValidation = async (
  existingAlert: Alert,
  updateData: Partial<Alert>
): Promise<void> => {
  if (!updateData.location) return;
  
  const newAlert = { ...existingAlert, ...updateData };
  const alertCheck = await validateLocation(newAlert);
  
  // Update the resolved location
  updateData.resolvedLocation = alertCheck.resolvedLocation;
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
  
  // Handle location validation if location is being updated
  await handleLocationValidation(existingAlert, updateData);
  
  // Check if we're updating condition-related fields
  if (isConditionUpdate(updateData)) {
    // Validate the updated alert structure
    validateAlertStructure({ ...existingAlert, ...updateData });
    
    // Recalculate isTriggered when conditions change
    await updateAlertTriggerState(existingAlert, updateData);
  }
  
  // Everything validated, update the alert
  return alertRepository.updateAlert(id, updateData);
};

/**
 * Prepare a new alert with current trigger state
 */
const prepareNewAlert = async (
  alertData: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>,
  alertCheck: AlertConditionResult
): Promise<Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>> => {
  return {
    ...alertData,
    isTriggered: alertCheck.isTriggered,
    lastChecked: new Date(),
    resolvedLocation: alertCheck.resolvedLocation,
    lastValue: alertCheck.currentValue
  };
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
  validateAlertStructure(alertData);
  
  // Check if the alert condition is currently met and validate location
  const alertCheck = await validateLocation({
    ...alertData,
    lastChecked: new Date()
  });
  
  // Create alert with the correct triggered state
  const newAlert = await prepareNewAlert(alertData, alertCheck);
  
  // Create the alert in the database
  return alertRepository.createAlert(newAlert);
};
