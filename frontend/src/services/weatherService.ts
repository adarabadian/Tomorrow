import axios from 'axios';
import { WeatherData } from '../types/weather';

const API_BASE_URL = 'http://localhost:3001/api';

// Define location parameter types
export type LocationCoordinates = { lat: number; lon: number };
export type LocationCity = { city: string };
export type LocationParam = LocationCoordinates | LocationCity;

/**
 * Fetch current weather data for a location
 */
export const fetchCurrentWeather = async (location: LocationParam): Promise<WeatherData> => {
  try {
    const params = 'lat' in location
      ? { lat: location.lat, lon: location.lon }
      : { city: location.city };

    const response = await axios.get(`${API_BASE_URL}/weather/current`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
}; 