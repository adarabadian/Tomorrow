import React from 'react';
import { Paper, Grid, Typography } from '@mui/material';
import { WeatherData } from '../../types/weather';
import { getWeatherIcon } from './WeatherIcons';

interface WeatherHeaderProps {
  weather: WeatherData;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({ weather }) => (
  <Paper 
    elevation={3} 
    sx={{ 
      p: 3, 
      mb: 4,
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      color: 'white'
    }}
  >
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={8} sm={10}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Current Weather {weather.location && `in ${weather.location}`}
        </Typography>
        <Typography variant="body1">
          Updated: {new Date(weather.timestamp).toLocaleString()}
        </Typography>
      </Grid>
      <Grid item xs={4} sm={2} sx={{ textAlign: 'center' }}>
        {getWeatherIcon(weather.temperature, weather.precipitation)}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
          {weather.temperature}°C
        </Typography>
      </Grid>
    </Grid>
  </Paper>
);

export default WeatherHeader; 