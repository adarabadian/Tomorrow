/**
 * Creates a standardized error message for invalid locations
 */
export const createInvalidLocationErrorMessage = (
  locationName: string,
  errorDetails?: string
): string => {
  return `Invalid location: "${locationName || 'Unknown'}". ${
    errorDetails || 'Could not fetch weather data'
  }. Please provide a valid city name or try removing commas (e.g. "New York" instead of "New York, NY").`;
};

/**
 * Common error messages
 */
export const ErrorMessages = {
  ALERT_NOT_FOUND: 'Alert not found',
  FAILED_TO_CREATE_ALERT: 'Failed to create alert',
  FAILED_TO_FETCH_ALERTS: 'Failed to fetch alerts',
  FAILED_TO_UPDATE_ALERT: 'Failed to update alert',
  FAILED_TO_DELETE_ALERT: 'Failed to delete alert',
  FAILED_TO_EVALUATE_ALERT: 'Failed to evaluate alert',
}; 