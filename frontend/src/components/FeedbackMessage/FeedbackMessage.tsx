import React from 'react';
import { Box, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './FeedbackMessage.css';
import '../Animations.css';

interface FeedbackMessageProps {
  type: 'success' | 'error' | 'loading' | 'info';
  message?: string;
  isSnackbar?: boolean;
  onClose?: () => void;
  autoHideDuration?: number;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ 
  type, 
  message,
  isSnackbar = false,
  onClose,
  autoHideDuration = 6000
}) => {
  if (isSnackbar) {
    return (
      <Snackbar
        open={!!message}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={onClose} 
          severity={type === 'loading' ? 'info' : type}
          variant="filled"
          sx={{ width: '100%' }}
          className="feedback-snackbar-content"
        >
          {message}
        </Alert>
      </Snackbar>
    );
  }

  if (type === 'loading') {
    return (
      <Box className="feedback-loading">
        <CircularProgress size={40} className="feedback-loading-spinner" />
        {message && (
          <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  if (type === 'success') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CheckCircleIcon color="success" fontSize="small" className="feedback-success-icon" />
        <Typography variant="body2" className="feedback-success">
          {message}
        </Typography>
      </Box>
    );
  }

  if (type === 'error') {
    return (
      <Typography variant="body2" className="feedback-error">
        {message}
      </Typography>
    );
  }

  return (
    <Typography variant="body2" className="feedback-info">
      {message}
    </Typography>
  );
};

export default FeedbackMessage; 