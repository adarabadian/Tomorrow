import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { WeatherData } from '../types/weather';
import { fetchCurrentWeather } from '../services/weatherService';

const Home: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        // Default to New York City coordinates
        const data = await fetchCurrentWeather({ lat: 40.7128, lon: -74.0060 });
        setWeather(data);
      } catch (err) {
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Current Weather
      </Typography>
      {weather && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Temperature</Typography>
              <Typography variant="h4">{weather.temperature}°C</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Wind Speed</Typography>
              <Typography variant="h4">{weather.windSpeed} m/s</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Precipitation</Typography>
              <Typography variant="h4">{weather.precipitation} mm</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Humidity</Typography>
              <Typography variant="h4">{weather.humidity}%</Typography>
            </Grid>
          </Grid>
          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            Last updated: {new Date(weather.timestamp).toLocaleString()}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Home; 