import React from 'react';
import { Paper, Typography } from '@mui/material';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <Paper sx={{ p: 3, backgroundColor: '#ffebee', mb: 4 }}>
    <Typography color="error" align="center">
      {message}
    </Typography>
  </Paper>
);

export default ErrorDisplay; 