import axios from 'axios';
import { WeatherData } from '../types/weather';

const API_BASE_URL = 'http://localhost:3001/api';

export const fetchCurrentWeather = async (location: { lat: number; lon: number } | { city: string }): Promise<WeatherData> => {
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