import { Response } from 'express';

/**
 * Create a validation error
 */
export const createValidationError = (message?: string): Error => {
  const error = new Error(message || 'Invalid data');
  error.name = 'ValidationError';
  return error;
};

/**
 * Create a location error
 */
export const createLocationError = (locationName: string, details?: string): Error => {
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
 * Handle service errors (validation and location errors) with proper status codes
 */
export const handleServiceError = (res: Response, error: any): boolean => {
  if (error.name === 'ValidationError' || error.name === 'LocationError') {
    res.status(400).json({ error: error.message });
    return true; // Error was handled
  }
  return false; // Not handled
};

/**
 * Standard error handler for controllers
 */
export const handleError = (res: Response, error: any, message: string): void => {
  console.error(message, error);
  res.status(500).json({ error: message });
};

/**
 * Log service-level errors (without HTTP responses)
 */
export const logError = {
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
  },
  
  api: (method: string, url: string, error: any): void => {
    console.error(`API error (${method} ${url}):`, error);
  }
}; 