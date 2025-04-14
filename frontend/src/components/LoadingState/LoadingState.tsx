import React from 'react';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  minHeight?: string | number;
  children: React.ReactNode;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  isEmpty = false,
  emptyMessage = 'No data available',
  minHeight = '300px',
  children
}) => {
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight={minHeight}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight={minHeight}
      >
        <Typography color="text.secondary" variant="body1">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default LoadingState; 