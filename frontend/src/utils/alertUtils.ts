import React from 'react';
import ThermometerIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

// Define parameter and condition types
export type ParameterType = 'temperature' | 'windSpeed' | 'precipitation' | 'humidity' | 'temp' | 'wind_speed';
export type ConditionType = '>' | '<' | '>=' | '<=' | '==' | 'gt' | 'lt' | 'eq';

// Structured parameter data for better organization
export const PARAMETER_DATA: Record<string, { label: string; icon: any; unit: string; aliases: string[] }> = {
  temperature: { label: 'Temperature', icon: ThermometerIcon, unit: '°C', aliases: ['temp'] },
  windSpeed: { label: 'Wind Speed', icon: AirIcon, unit: 'm/s', aliases: ['wind_speed'] },
  precipitation: { label: 'Precipitation', icon: WaterDropIcon, unit: 'mm', aliases: [] },
  humidity: { label: 'Humidity', icon: WaterDropIcon, unit: '%', aliases: [] }
};

// Parameters for UI dropdown
export const PARAMETERS = Object.entries(PARAMETER_DATA).map(([value, data]) => ({
  value,
  label: data.label,
  icon: React.createElement(data.icon),
  unit: data.unit
}));

// Structured condition data
export const CONDITION_DATA: Record<string, { label: string; text: string; aliases: string[] }> = {
  '>': { label: 'Greater than (>)', text: 'greater than', aliases: ['gt'] },
  '<': { label: 'Less than (<)', text: 'less than', aliases: ['lt'] },
  '>=': { label: 'Greater than or equal to (>=)', text: 'greater than or equal to', aliases: [] },
  '<=': { label: 'Less than or equal to (<=)', text: 'less than or equal to', aliases: [] },
  '==': { label: 'Equal to (==)', text: 'equal to', aliases: ['eq'] }
};

// Conditions for UI dropdown
export const CONDITIONS = Object.entries(CONDITION_DATA).map(([value, data]) => ({
  value,
  label: data.label
}));

// Default alert configuration
export const DEFAULT_ALERT = {
  name: '',
  location: { city: '' },
  parameter: 'temperature' as ParameterType,
  condition: '>' as ConditionType,
  threshold: 0,
  description: '',
  userEmail: ''
};

// Helper function to normalize parameters (handle aliases)
const normalizeParameter = (parameter: string): keyof typeof PARAMETER_DATA => {
  for (const [key, data] of Object.entries(PARAMETER_DATA)) {
    if (key === parameter || data.aliases.includes(parameter as string)) {
      return key as keyof typeof PARAMETER_DATA;
    }
  }
  return 'temperature'; // Default fallback
};

// Helper function to normalize conditions (handle aliases)
const normalizeCondition = (condition: string): keyof typeof CONDITION_DATA => {
  for (const [key, data] of Object.entries(CONDITION_DATA)) {
    if (key === condition || data.aliases.includes(condition as string)) {
      return key as keyof typeof CONDITION_DATA;
    }
  }
  return '>'; // Default fallback
};

// Helper function to convert condition to readable text
export const getConditionText = (condition: string): string => {
  const normalizedCondition = normalizeCondition(condition);
  return CONDITION_DATA[normalizedCondition].text;
};

// Helper function to get the parameter name
export const getParameterName = (parameter: string): string => {
  const normalizedParam = normalizeParameter(parameter);
  return PARAMETER_DATA[normalizedParam].label;
};

// Helper function to get the parameter icon
export const getParameterIcon = (parameter: string): React.ReactNode => {
  const normalizedParam = normalizeParameter(parameter);
  const IconComponent = PARAMETER_DATA[normalizedParam].icon;
  return React.createElement(IconComponent);
};

// Helper function to get parameter unit
export const getParameterUnit = (parameter: string): string => {
  const normalizedParam = normalizeParameter(parameter);
  return PARAMETER_DATA[normalizedParam].unit;
};

// Format a condition for display
export const formatCondition = (parameter: string, condition: string, threshold: number): string => {
  return `${getConditionText(condition)} ${threshold}${getParameterUnit(parameter)}`;
}; 