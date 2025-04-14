/**
 * Application-wide constants and configuration
 */

// Environment determination
export const ENV = {
  DEV: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
  PROD: process.env.NODE_ENV === 'production',
  TEST: process.env.NODE_ENV === 'test',
};

// Server configuration
export const SERVER = {
  PORT: process.env.PORT || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

// API endpoints and keys
export const API = {
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',
  WEATHER_API_URL: process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5',
};

// Database settings
export const DB = {
  CONNECTION_POOL_SIZE: parseInt(process.env.DB_POOL_SIZE || '10', 10),
  CONNECTION_TIMEOUT: parseInt(process.env.DB_TIMEOUT || '30000', 10),
};

// Logging settings
export const LOGGING = {
  LEVEL: ENV.PROD ? 'info' : 'debug',
  FILE_ENABLED: ENV.PROD,
};

// Alert constants
export const ALERTS = {
  CHECK_INTERVAL_MINUTES: parseInt(process.env.ALERT_CHECK_INTERVAL_MINUTES || '15', 10),
  MAX_ALERTS_PER_USER: parseInt(process.env.MAX_ALERTS_PER_USER || '100', 10),
}; 