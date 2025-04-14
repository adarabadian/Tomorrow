import { useState, useCallback } from 'react';
import { WeatherData } from '../types/weather';
import { fetchCurrentWeather } from '../services/weatherService';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');

  const fetchWeather = useCallback(async (locationParam: { city: string } | { lat: number; lon: number }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentWeather(locationParam);
      setWeather(data);
      
      if ('city' in locationParam) {
        setLocation(locationParam.city);
      } else {
        setLocation(`${locationParam.lat.toFixed(2)}, ${locationParam.lon.toFixed(2)}`);
      }
    } catch (err) {
      setError('Failed to load weather data. Please check the location and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather({ 
            lat: position.coords.latitude, 
            lon: position.coords.longitude 
          });
        },
        (error) => {
          setError('Unable to retrieve your location. Please enter it manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter your location manually.');
    }
  }, [fetchWeather]);

  return {
    weather,
    loading,
    error,
    location,
    fetchWeather,
    getCurrentLocation
  };
}; 