import { Location } from '../utils/locationUtils';

// Types for location validation
export type ValidationResult = { valid: boolean; error?: string; location?: Location };

/**
 * Check if required location parameters are present
 */
export const hasLocationParams = (query: any): boolean => {
  const { lat, lon, city } = query;
  return Boolean(city || (lat && lon));
};

/**
 * Validate latitude value
 */
export const isValidLatitude = (lat: any): boolean => {
  const numLat = Number(lat);
  return !isNaN(numLat) && numLat >= -90 && numLat <= 90;
};

/**
 * Validate longitude value
 */
export const isValidLongitude = (lon: any): boolean => {
  const numLon = Number(lon);
  return !isNaN(numLon) && numLon >= -180 && numLon <= 180;
};

/**
 * Validate and parse coordinate-based location
 */
export const validateCoordinates = (lat: any, lon: any): ValidationResult => {
  const numLat = Number(lat);
  const numLon = Number(lon);
  
  if (isNaN(numLat) || isNaN(numLon)) return {
    valid: false,
    error: 'Coordinates must be valid numbers'
  };
  
  if (!isValidLatitude(lat)) return {
    valid: false,
    error: 'Latitude must be between -90 and 90'
  };
  
  if (!isValidLongitude(lon)) return {
    valid: false,
    error: 'Longitude must be between -180 and 180'
  };
  
  return {
    valid: true,
    location: {
      lat: numLat,
      lon: numLon
    }
  };
};

/**
 * Validate and parse city-based location
 */
export const validateCity = (city: any): ValidationResult => {
  if (typeof city !== 'string' || city.trim().length === 0) {
    return {
      valid: false,
      error: 'City name must be a non-empty string'
    };
  }
  
  return {
    valid: true,
    location: { city: city.trim() }
  };
};

/**
 * Validate query parameters for weather request
 */
export const validateLocationParams = (query: any): ValidationResult => {
  const { lat, lon, city } = query;
  
  // Check if any location parameters are provided
  if (!hasLocationParams(query)) return { 
    valid: false, 
    error: 'Either coordinates (lat, lon) or city must be provided' 
  };

  // Prioritize coordinates if both are provided
  if (lat && lon) return validateCoordinates(lat, lon);
  if (city) return validateCity(city);
  
  return { 
    valid: false, 
    error: 'Invalid location parameters' 
  };
}; 