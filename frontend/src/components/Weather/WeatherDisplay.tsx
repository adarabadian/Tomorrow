import React from 'react';
import { Box, Grid, Fade } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import { WeatherData } from '../../types/weather';
import WeatherHeader from './WeatherHeader';
import WeatherMetricCard from './WeatherMetricCard';
import PrecipitationCard from './PrecipitationCard';

interface WeatherDisplayProps {
  weather: WeatherData;
  animate?: boolean;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, animate = true }) => {
  return (
    <Fade in={animate} timeout={500}>
      <Box>
        <WeatherHeader weather={weather} />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <WeatherMetricCard
              icon={<ThermostatIcon fontSize="large" sx={{ color: '#ff5722' }} />}
              title="Temperature"
              value={weather.temperature}
              unit="°C"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <WeatherMetricCard
              icon={<AirIcon fontSize="large" sx={{ color: '#03a9f4' }} />}
              title="Wind Speed"
              value={weather.windSpeed}
              unit="m/s"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <WeatherMetricCard
              icon={<OpacityIcon fontSize="large" sx={{ color: '#4caf50' }} />}
              title="Humidity"
              value={weather.humidity}
              unit="%"
            />
          </Grid>
        </Grid>

        <PrecipitationCard precipitation={weather.precipitation} />
      </Box>
    </Fade>
  );
};

export default WeatherDisplay; 