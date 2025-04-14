import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  WeatherSearch,
  WeatherDisplay,
  ErrorDisplay
} from '../components/Weather';
import { useWeather } from '../hooks/useWeather';

const Home: React.FC = () => {
  const { weather, loading, error, location, fetchWeather, getCurrentLocation } = useWeather();

  // Initial load with default location
  useEffect(() => {
    fetchWeather({ city: 'New York City' });
  }, [fetchWeather]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Weather Dashboard
      </Typography>

      <WeatherSearch 
        initialLocation={location}
        onSearch={fetchWeather}
        onGetCurrentLocation={getCurrentLocation}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <ErrorDisplay message={error} />
      ) : weather ? (
        <WeatherDisplay weather={weather} animate={true} />
      ) : null}
    </Box>
  );
};

export default Home; 