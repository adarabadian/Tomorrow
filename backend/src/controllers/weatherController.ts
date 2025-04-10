import { Request, Response } from 'express';
import { getCurrentWeather } from '../services/weatherService';

export const handleCurrentWeatherRequest = async (req: Request, res: Response) => {
  try {
    const { lat, lon, city } = req.query;
    
    if (!lat && !lon && !city) {
      return res.status(400).json({ error: 'Either coordinates (lat, lon) or city must be provided' });
    }

    let location: { lat: number; lon: number } | { city: string };
    
    if (lat && lon) {
      location = {
        lat: Number(lat),
        lon: Number(lon)
      };
    } else if (city) {
      location = { city: city as string };
    } else {
      return res.status(400).json({ error: 'Invalid location parameters' });
    }

    const weather = await getCurrentWeather(location);
    res.json(weather);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}; 