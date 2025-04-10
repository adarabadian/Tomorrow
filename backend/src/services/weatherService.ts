import axios from 'axios';
import { Location, formatLocationParam, formatLocationString } from '../utils/locationUtils';

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  humidity: number;
  timestamp: string;
  location: string;
}

export const getCurrentWeather = async (location: Location): Promise<WeatherData> => {
  try {
    const apiKey = process.env.TOMORROW_API_KEY;
    if (!apiKey) throw new Error('API key is required to fetch weather data');

    const locationParam = formatLocationParam(location);
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
  } catch (error: any) {
    return handleWeatherApiError(error);
  }
};

const handleWeatherApiError = (error: any): never => {
  console.error("Error fetching weather data:", error);

  if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("API key invalid or unauthorized");
  } else if (error.response?.status === 429) {
      throw new Error("API rate limit exceeded");
  } else if (error.response?.data.type === "Invalid Query Parameters") {
      throw new Error("Location not found");
  }

  throw new Error("Failed to fetch weather data");
};