import React from 'react';
import {
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';

interface NotificationsProps {
  successMessage: string | null;
  errorMessage: string | null;
  onClearSuccess: () => void;
  onClearError: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  successMessage,
  errorMessage,
  onClearSuccess,
  onClearError
}) => {
  return (
    <>
      {/* Success Snackbar */}
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={onClearSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert 
          onClose={onClearSuccess} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </MuiAlert>
      </Snackbar>
      
      {/* Error Snackbar */}
      <Snackbar 
        open={!!errorMessage} 
        autoHideDuration={6000} 
        onClose={onClearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert 
          onClose={onClearError} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default Notifications; 