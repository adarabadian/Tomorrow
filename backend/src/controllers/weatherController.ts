import { Request, Response } from 'express';
import { getCurrentWeather } from '../services/weatherService';
import { Location } from '../utils/locationUtils';

/**
 * Validate query parameters for weather request
 */
const validateLocationParams = (query: any): { valid: boolean; error?: string; location?: Location } => {
  const { lat, lon, city } = query;
  
  if (!lat && !lon && !city) {
    return { 
      valid: false, 
      error: 'Either coordinates (lat, lon) or city must be provided' 
    };
  }

  if (lat && lon) {
    // Validate coordinates
    const numLat = Number(lat);
    const numLon = Number(lon);
    
    if (isNaN(numLat) || isNaN(numLon)) {
      return {
        valid: false,
        error: 'Coordinates must be valid numbers'
      };
    }
    
    if (numLat < -90 || numLat > 90) {
      return {
        valid: false,
        error: 'Latitude must be between -90 and 90'
      };
    }
    
    if (numLon < -180 || numLon > 180) {
      return {
        valid: false,
        error: 'Longitude must be between -180 and 180'
      };
    }
    
    return {
      valid: true,
      location: {
        lat: numLat,
        lon: numLon
      }
    };
  } else if (city) {
    // Validate city
    if (typeof city !== 'string' || city.trim().length === 0) {
      return {
        valid: false,
        error: 'City name must be a non-empty string'
      };
    }
    
    return {
      valid: true,
      location: { city: city as string }
    };
  }
  
  return { 
    valid: false, 
    error: 'Invalid location parameters' 
  };
};

/**
 * Handle request for current weather
 */
export const handleCurrentWeatherRequest = async (req: Request, res: Response) => {
  try {
    // Validate request parameters
    const validation = validateLocationParams(req.query);
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    
    // Fetch weather data
    const weather = await getCurrentWeather(validation.location!);
    res.json(weather);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}; 