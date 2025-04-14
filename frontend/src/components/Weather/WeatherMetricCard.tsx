import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

interface WeatherMetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  unit: string;
}

const WeatherMetricCard: React.FC<WeatherMetricCardProps> = ({ 
  icon, 
  title, 
  value, 
  unit 
}) => (
  <Card elevation={2} sx={{ height: '100%' }}>
    <CardContent sx={{ textAlign: 'center' }}>
      <Box sx={{ mb: 1 }}>{icon}</Box>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {value}<Typography variant="h6" component="span" sx={{ ml: 0.5 }}>{unit}</Typography>
      </Typography>
    </CardContent>
  </Card>
);

export default WeatherMetricCard; 