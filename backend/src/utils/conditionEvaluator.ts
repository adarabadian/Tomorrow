import { Alert } from '../models/Alert';

/**
 * Evaluates if an alert condition is met based on the current value
 */
export const evaluateCondition = (currentValue: number, alert: Alert): boolean => {
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
      // Apply rounding for all parameters when checking equality
      // This makes alerts trigger when current value falls within a sensible range
      // (e.g., 17.x matches threshold 17)
      const floorValue = Math.floor(currentValue);
      return floorValue === alert.threshold;
    default:
      throw new Error(`Invalid condition: ${alert.condition}`);
  }
};

/**
 * Get the parameter value from a weather data object
 */
export const getParameterValue = (weather: any, parameterName: string): number => {
  const value = Number(weather[parameterName]);
  if (isNaN(value)) {
    throw new Error(`Invalid weather parameter: ${parameterName}`);
  }
  return value;
}; 