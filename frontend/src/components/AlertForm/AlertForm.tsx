import React, { useState } from 'react';
import {
  Typography,
  Paper,
  Button,
  Box
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

// Import component parts
import AlertBasicInfo from '../AlertBasicInfo/AlertBasicInfo';
import LocationInput from '../LocationInput/LocationInput';
import AlertParameters from '../AlertParameters/AlertParameters';

// Import from shared utils
import { DEFAULT_ALERT } from '../../utils/alertUtils';
import { CreateAlertPayload } from '../../types/alert';
import './AlertForm.css';
import '../Animations.css';

// Types
interface AlertFormProps {
  onSubmit: (alert: CreateAlertPayload) => Promise<void>;
  onSuccess: () => void;
}

// Type for form errors
type FormErrors = Record<string, string | null>;

const AlertForm: React.FC<AlertFormProps> = ({ onSubmit, onSuccess }) => {
  const [newAlert, setNewAlert] = useState<CreateAlertPayload>({
    name: '',
    description: '',
    location: {
      city: ''
    },
    parameter: 'temperature',
    threshold: 0,
    condition: '>',
    userEmail: ''
  });
  const [useCoordinates, setUseCoordinates] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (!name) return;
    
    updateFormValue(name, value);
    clearFieldError(name);
  };

  /**
   * Update form values based on input field name
   */
  const updateFormValue = (name: string, value: unknown) => {
    if (name === 'lat' || name === 'lon') {
      setNewAlert({
        ...newAlert,
        location: {
          ...newAlert.location,
          coordinates: {
            ...(newAlert.location.coordinates || { lat: 0, lon: 0 }),
            [name]: Number(value)
          }
        }
      });
    } else if (name === 'city') {
      setNewAlert({
        ...newAlert,
        location: { city: value as string }
      });
    } else {
      setNewAlert({
        ...newAlert,
        [name]: value
      });
    }
  };

  /**
   * Clear error for a specific field
   */
  const clearFieldError = (fieldName: string) => {
    if (formErrors[fieldName]) {
      setFormErrors({
        ...formErrors,
        [fieldName]: null
      });
    }
  };

  /**
   * Toggle between city and coordinates
   */
  const handleLocationTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseCoordinates(e.target.checked);
    if (e.target.checked) {
      setNewAlert({
        ...newAlert,
        location: { coordinates: { lat: 0, lon: 0 } }
      });
    } else {
      setNewAlert({
        ...newAlert,
        location: { city: '' }
      });
    }
  };

  /**
   * Validate form before submission
   */
  const validateForm = (): boolean => {
    const errors = validateAlertForm(newAlert, useCoordinates);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Submit new alert
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(newAlert);
      setNewAlert(DEFAULT_ALERT as CreateAlertPayload);
      onSuccess();
    } catch (err) {
      // Error handling is done at the parent level
      console.error('Error submitting alert:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} className="alert-form-container">
      <Typography variant="h6" gutterBottom>
        Create New Alert
      </Typography>
      <form onSubmit={handleSubmit} className="alert-form">
        <Box className="alert-form-section alert-form-section-1">
          <Typography variant="subtitle1" className="alert-form-section-title">
            Basic Information
          </Typography>
          <AlertBasicInfo 
            name={newAlert.name}
            description={newAlert.description || ''}
            userEmail={newAlert.userEmail}
            onInputChange={handleInputChange}
            formErrors={formErrors}
          />
        </Box>
        
        <Box className="alert-form-section alert-form-section-2">
          <Typography variant="subtitle1" className="alert-form-section-title">
            Location
          </Typography>
          <LocationInput 
            useCoordinates={useCoordinates}
            onLocationTypeChange={handleLocationTypeChange}
            location={newAlert.location}
            onInputChange={handleInputChange}
            formErrors={formErrors}
          />
        </Box>
        
        <Box className="alert-form-section alert-form-section-3">
          <Typography variant="subtitle1" className="alert-form-section-title">
            Alert Conditions
          </Typography>
          <AlertParameters 
            parameter={newAlert.parameter}
            condition={newAlert.condition}
            threshold={newAlert.threshold}
            onInputChange={handleInputChange}
          />
        </Box>
        
        {/* Submit button */}
        <Box className="alert-form-button-container" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            startIcon={<NotificationsActiveIcon />}
            disabled={isSubmitting}
            className="alert-form-button"
          >
            {isSubmitting ? 'Creating...' : 'Create Alert'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

/**
 * Validate alert form data
 */
const validateAlertForm = (alert: CreateAlertPayload, useCoordinates: boolean): FormErrors => {
  const errors: FormErrors = {};
  
  if (!alert.name.trim()) errors.name = 'Name is required';
  
  if (useCoordinates) {
    if (!alert.location?.coordinates?.lat && alert.location?.coordinates?.lat !== 0) {
      errors.lat = 'Latitude is required';
    } else if (alert.location.coordinates.lat < -90 || alert.location.coordinates.lat > 90) {
      errors.lat = 'Latitude must be between -90 and 90';
    }
    
    if (!alert.location?.coordinates?.lon && alert.location?.coordinates?.lon !== 0) {
      errors.lon = 'Longitude is required';
    } else if (alert.location.coordinates.lon < -180 || alert.location.coordinates.lon > 180) {
      errors.lon = 'Longitude must be between -180 and 180';
    }
  } else {
    if (!alert.location?.city?.trim()) errors.city = 'City is required';
  }
  
  if (!alert.userEmail.trim()) {
    errors.userEmail = 'Email is required for notifications';
  } else if (!/\S+@\S+\.\S+/.test(alert.userEmail)) {
    errors.userEmail = 'Email address is invalid';
  }
  
  return errors;
};

export default AlertForm; 