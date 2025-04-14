import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

interface PrecipitationCardProps {
  precipitation: number;
}

const PrecipitationCard: React.FC<PrecipitationCardProps> = ({ precipitation }) => (
  <Card elevation={3}>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Precipitation Chance
      </Typography>
      <Box sx={{ 
        height: 24, 
        width: '100%', 
        bgcolor: '#e0e0e0',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Box sx={{ 
          height: '100%', 
          width: `${precipitation}%`,
          bgcolor: precipitation > 60 ? '#f44336' : (precipitation > 30 ? '#ff9800' : '#4caf50'),
          transition: 'width 1s ease-in-out'
        }} />
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center' 
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white', textShadow: '0px 0px 2px rgba(0,0,0,0.7)' }}>
            {precipitation}%
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default PrecipitationCard; 