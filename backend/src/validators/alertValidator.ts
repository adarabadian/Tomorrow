import { Alert } from '../models/Alert';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const VALID_PARAMETERS = ['temperature', 'windSpeed', 'precipitation', 'humidity'];
const VALID_CONDITIONS = ['>', '<', '>=', '<=', '=='];


const validateRequiredFields = (data: Partial<Alert>): ValidationResult => {
  const { location, parameter, threshold, condition } = data;
  
  if (!location || !parameter || threshold === undefined || !condition) {
    return { 
      valid: false,
      error: 'Missing required fields: location, parameter, threshold, and condition are required'
    };
  }
  
  return { valid: true };
};

const validateLocation = (location: any): ValidationResult => {
  if (!location) return { valid: true }; // Skip if already checked in required fields
  
  if ((!location.city && (!location.coordinates || !location.coordinates.lat || !location.coordinates.lon))) {
    return { 
      valid: false,
      error: 'Location must be specified with either city or coordinates (lat, lon)'
    };
  }
  
  return { valid: true };
};

const validateParameter = (parameter: string | undefined): ValidationResult => {
  if (!parameter) return { valid: true }; // Skip if already checked in required fields
  
  if (!VALID_PARAMETERS.includes(parameter)) {
    return {
      valid: false,
      error: `Invalid parameter: ${parameter}. Valid parameters are: ${VALID_PARAMETERS.join(', ')}`
    };
  }
  
  return { valid: true };
};

const validateCondition = (condition: string | undefined): ValidationResult => {
  if (!condition) return { valid: true }; // Skip if already checked in required fields
  
  if (!VALID_CONDITIONS.includes(condition)) {
    return {
      valid: false,
      error: `Invalid condition: ${condition}. Valid conditions are: ${VALID_CONDITIONS.join(', ')}`
    };
  }
  
  return { valid: true };
};

const validateThreshold = (threshold: number | undefined): ValidationResult => {
  if (threshold === undefined) return { valid: true }; // Skip if already checked in required fields
  
  if (isNaN(Number(threshold))) {
    return {
      valid: false,
      error: 'Threshold must be a valid number'
    };
  }
  
  return { valid: true };
};

// Run all validations
export const validateAlertData = (data: Partial<Alert>): ValidationResult => {
  const validations = [
    validateRequiredFields(data),
    validateLocation(data.location),
    validateParameter(data.parameter),
    validateCondition(data.condition),
    validateThreshold(data.threshold)
  ];
  
  // Find the first validation error
  const firstError = validations.find(result => !result.valid);
  if (firstError) return firstError;
  
  // All validations passed
  return { valid: true };
}; 