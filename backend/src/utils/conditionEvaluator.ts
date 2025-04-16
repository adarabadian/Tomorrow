import { Alert } from '../models/Alert';

/**
 * Evaluates if an alert condition is met based on the current value
 */
export const evaluateCondition = (currentValue: number, alert: Alert): boolean => {
  const { condition, threshold } = alert;
  
  switch (condition) {
    case '>': return currentValue > threshold;
    case '<': return currentValue < threshold;
    case '>=': return currentValue >= threshold;
    case '<=': return currentValue <= threshold;
    case '==': return Math.floor(currentValue) === threshold; // Apply rounding for equality
    default: throw new Error(`Invalid condition: ${condition}`);
  }
};

/**
 * Get the parameter value from a weather data object
 */
export const getParameterValue = (weather: any, parameterName: string): number => {
  const value = Number(weather[parameterName]);
  if (isNaN(value)) throw new Error(`Invalid weather parameter: ${parameterName}`);
  return value;
}; 