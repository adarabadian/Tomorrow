import { Request, Response } from 'express';
import { getCurrentWeather, getCacheStatus, clearWeatherCache } from '../services/weatherService';
import { validateLocationParams } from '../validators/locationValidator';

// Default location configuration (can be moved to environment variables if needed)
const DEFAULT_LOCATION = { city: 'New York City' };

/**
 * Standard error handler for weather controllers
 */
const handleError = (res: Response, error: any, message: string): void => {
  console.error(message, error);
  res.status(500).json({ error: message });
};

/**
 * Handle request for current weather
 */
export const handleCurrentWeatherRequest = async (req: Request, res: Response) => {
  try {
    // Validate request parameters
    const validation = validateLocationParams(req.query);
    if (!validation.valid) return res.status(400).json({ error: validation.error });
    
    // Fetch weather data
    const weather = await getCurrentWeather(validation.location!);
    res.json(weather);
  } catch (error) {
    handleError(res, error, 'Failed to fetch weather data');
  }
};

/**
 * Handle request for default location weather (used on homepage)
 */
export const handleDefaultLocationWeatherRequest = async (_req: Request, res: Response) => {
  try {
    // Use the configured default location
    const weather = await getCurrentWeather(DEFAULT_LOCATION);
    res.json(weather);
  } catch (error) {
    handleError(res, error, 'Failed to fetch weather data for default location');
  }
};

/**
 * Get cache status information
 */
export const handleCacheStatusRequest = (_req: Request, res: Response) => {
  try {
    const cacheStatus = getCacheStatus();
    res.json({ cacheStatus });
  } catch (error) {
    handleError(res, error, 'Failed to retrieve cache status');
  }
};

/**
 * Clear weather cache (for admin/debug purposes)
 */
export const handleClearCacheRequest = (req: Request, res: Response) => {
  try {
    if (req.query.location) {
      const validation = validateLocationParams(req.query);
      if (validation.valid && validation.location) {
        clearWeatherCache(validation.location);
        return res.json({ message: 'Cache cleared for specified location' });
      }

      return res.status(400).json({ error: 'Invalid location parameters' });
    } else {
      clearWeatherCache();
      return res.json({ message: 'Cache cleared for all locations' });
    }
  } catch (error) {
    handleError(res, error, 'Failed to clear cache');
  }
}; 