import { Alert } from '../models/Alert';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates alert data for creation and updates
 * @param data The alert data to validate
 * @returns Validation result with valid flag and optional error message
 */
export const validateAlertData = (data: Partial<Alert>): ValidationResult => {
  // Required fields check
  const { location, parameter, threshold, condition } = data;
  
  if (!location || !parameter || threshold === undefined || !condition) {
    return { 
      valid: false,
      error: 'Missing required fields: location, parameter, threshold, and condition are required'
    };
  }
  
  // Location format check
  if ((!location.city && (!location.coordinates || !location.coordinates.lat || !location.coordinates.lon))) {
    return { 
      valid: false,
      error: 'Location must be specified with either city or coordinates (lat, lon)'
    };
  }
  
  // Parameter validation
  const validParameters = ['temperature', 'windSpeed', 'precipitation', 'humidity'];
  if (!validParameters.includes(parameter)) {
    return {
      valid: false,
      error: `Invalid parameter: ${parameter}. Valid parameters are: ${validParameters.join(', ')}`
    };
  }
  
  // Condition validation
  const validConditions = ['>', '<', '>=', '<=', '=='];
  if (!validConditions.includes(condition)) {
    return {
      valid: false,
      error: `Invalid condition: ${condition}. Valid conditions are: ${validConditions.join(', ')}`
    };
  }
  
  // Threshold validation (must be a number)
  if (isNaN(Number(threshold))) {
    return {
      valid: false,
      error: 'Threshold must be a valid number'
    };
  }
  
  return { valid: true };
}; 