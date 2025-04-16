import axios from 'axios';
import { Location, formatLocationParam, formatLocationString } from '../utils/locationUtils';
import { createLocationError } from '../utils/errorHandlers';

// Types
export interface WeatherData {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  humidity: number;
  timestamp: string;
  location: string;
}

interface CachedWeatherData {
  data: WeatherData;
  timestamp: number;
}

// Constants
const CACHE_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

// Caches
const weatherCache = new Map<string, CachedWeatherData>();
const locationFailures = new Map<string, { timestamp: Date, reason: string }>();

/**
 * Get weather data for a specific location
 */
export const getCurrentWeather = async (location: Location): Promise<WeatherData> => {
  const locationParam = formatLocationParam(location);
  const cachedEntry = weatherCache.get(locationParam);
  
  // Return cached data if valid
  if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_EXPIRATION_MS) {
    console.log(`Returning cached weather data for ${locationParam}`);
    return cachedEntry.data;
  }
  
  try {
    const weatherData = await fetchWeatherFromApi(location, locationParam);
    
    // Cache the new data and clear failures
    weatherCache.set(locationParam, { data: weatherData, timestamp: Date.now() });
    locationFailures.delete(locationParam);
    
    return weatherData;
  } catch (error: any) {
    return handleWeatherApiError(error, locationParam);
  }
};

/**
 * Check if cached data for a location is still valid
 */
const isCacheValid = (locationParam: string): boolean => {
  const cachedData = weatherCache.get(locationParam);
  return !!cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION_MS;
};

/**
 * Fetch and format weather data from the API
 */
const fetchWeatherFromApi = async (location: Location, locationParam: string): Promise<WeatherData> => {
  const apiKey = process.env.TOMORROW_API_KEY;
  if (!apiKey) throw new Error('API key is required to fetch weather data');

  const url = `https://api.tomorrow.io/v4/weather/realtime?${locationParam}&apikey=${apiKey}&units=metric`;
  const response = await axios.get(url);
  const data = response.data;
  
  return {
    temperature: data.data.values.temperature,
    windSpeed: data.data.values.windSpeed,
    precipitation: data.data.values.precipitationProbability || 0,
    humidity: data.data.values.humidity,
    timestamp: data.data.time,
    location: formatLocationString(data.location, location)
  };
};

/**
 * Handle errors from the weather API
 */
const handleWeatherApiError = (error: any, locationParam: string): never => {
  const reason = error.response?.status === 401 || error.response?.status === 403 ? "API key invalid or unauthorized" :
    error.response?.status === 429 ? "API rate limit exceeded" :
    error.response?.data?.type === "Invalid Query Parameters" ? "Location not found" :
    "Failed to fetch weather data";
  
  // Record the failure
  locationFailures.set(locationParam, { 
    timestamp: new Date(),
    reason
  });

  throw createLocationError(locationParam, reason);
};

/**
 * Manually clear cache for a specific location or all locations
 */
export const clearWeatherCache = (location?: Location) => {
  if (location) {
    const locationParam = formatLocationParam(location);
    weatherCache.delete(locationParam);
    return;
  }

  weatherCache.clear();
};

/**
 * Get information about the current cache state
 */
export const getCacheStatus = () => {
  return Array.from(weatherCache.entries()).map(([location, data]) => ({
    location,
    timestamp: new Date(data.timestamp),
    ageInSeconds: Math.round((Date.now() - data.timestamp) / 1000),
    expiresInSeconds: Math.round((data.timestamp + CACHE_EXPIRATION_MS - Date.now()) / 1000)
  }));
};

// Get status of location requests - useful for health monitoring
export const getLocationRequestStatus = () => {
  return {
    failedLocations: Array.from(locationFailures.entries()).map(([location, data]) => ({
      location,
      timestamp: data.timestamp,
      reason: data.reason,
      ageInMinutes: Math.round((Date.now() - data.timestamp.getTime()) / 60000)
    }))
  };
};