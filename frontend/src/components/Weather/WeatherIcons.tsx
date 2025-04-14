import React from 'react';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

/**
 * Get a weather icon based on temperature and precipitation
 */
export const getWeatherIcon = (temperature: number, precipitation: number) => {
  if (precipitation > 50) return <OpacityIcon fontSize="large" sx={{ color: '#2196f3' }} />;
  if (temperature > 25) return <WbSunnyIcon fontSize="large" sx={{ color: '#ff9800' }} />;
  return <WbSunnyIcon fontSize="large" sx={{ color: '#fdd835' }} />;
}; 