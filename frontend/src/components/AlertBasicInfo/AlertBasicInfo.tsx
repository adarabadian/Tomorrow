import React from 'react';
import { Grid, TextField, Box, Tooltip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import './AlertBasicInfo.css';
import '../Animations.css';

interface AlertBasicInfoProps {
  name: string;
  description: string;
  userEmail: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formErrors: Record<string, string | null>;
}

const AlertBasicInfo: React.FC<AlertBasicInfoProps> = ({
  name,
  description,
  userEmail,
  onInputChange,
  formErrors
}) => {
  // Validation states
  const nameValid = name.trim() !== '' && !formErrors.name;
  const emailValid = userEmail.trim() !== '' && /\S+@\S+\.\S+/.test(userEmail) && !formErrors.userEmail;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <Box className="alert-basic-info-field">
          <TextField
            fullWidth
            label="Alert Name"
            name="name"
            value={name}
            onChange={onInputChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            required
            InputProps={{
              endAdornment: nameValid && name.trim() !== '' ? (
                <CheckCircleIcon className="alert-basic-info-valid-icon" fontSize="small" />
              ) : null
            }}
          />
        </Box>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Box className="alert-basic-info-field">
          <TextField
            fullWidth
            label="Email for Notifications"
            name="userEmail"
            type="email"
            value={userEmail}
            onChange={onInputChange}
            error={!!formErrors.userEmail}
            helperText={formErrors.userEmail}
            required
            InputProps={{
              endAdornment: emailValid && userEmail.trim() !== '' ? (
                <CheckCircleIcon className="alert-basic-info-valid-icon" fontSize="small" />
              ) : null
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" className="alert-basic-info-email-help">
              You will receive weather alerts at this email address
            </Typography>
            <Tooltip title="We'll send you email notifications when your alert conditions are met">
              <HelpOutlineIcon 
                fontSize="small" 
                sx={{ ml: 1, fontSize: '14px', color: 'text.secondary' }} 
                className="alert-basic-info-icon"
              />
            </Tooltip>
          </Box>
        </Box>
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description (Optional)"
          name="description"
          multiline
          rows={2}
          value={description}
          onChange={onInputChange}
        />
      </Grid>
    </Grid>
  );
};

export default AlertBasicInfo; 