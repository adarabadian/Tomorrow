import axios from 'axios';

const TOMORROW_API_KEY = process.env.TOMORROW_API_KEY;
const TOMORROW_API_URL = 'https://api.tomorrow.io/v4';

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  humidity: number;
  timestamp: string;
  location: string;
}

export const getCurrentWeather = async (location: { lat: number; lon: number } | { city: string }): Promise<WeatherData> => {
  try {
    const locationParam = 'lat' in location 
      ? `location=${location.lat},${location.lon}`
      : `location=${encodeURIComponent(location.city)}`;

      
    const response = await axios.get(
        `${TOMORROW_API_URL}/weather/realtime?${locationParam}&apikey=${TOMORROW_API_KEY}`
    );

    const weatherData = response.data.data;
    const locationData = response.data.location;
    
    return {
        temperature: weatherData.values.temperature,
        windSpeed: weatherData.values.windSpeed,
        precipitation: weatherData.values.precipitation,
        humidity: weatherData.values.humidity,
        timestamp: weatherData.time,
        location: locationData
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};