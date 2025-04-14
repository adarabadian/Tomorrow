import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AlertBasicInfo from '../AlertBasicInfo/AlertBasicInfo';
import LocationInput from '../LocationInput/LocationInput';
import AlertParameters from '../AlertParameters/AlertParameters';
import FeedbackMessage from '../FeedbackMessage/FeedbackMessage';
import { Alert } from '../../types/alert';
import './AlertEditForm.css';
import '../Animations.css';

// Types
interface AlertEditFormProps {
  alert: Alert;
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string, alert: Partial<Alert>) => Promise<void>;
}

const AlertEditForm: React.FC<AlertEditFormProps> = ({ alert, open, onClose, onSubmit }) => {
  const [editedAlert, setEditedAlert] = useState<Partial<Alert>>({
    name: '',
    description: '',
    location: {
      city: ''
    },
    parameter: 'temperature',
    threshold: 0,
    condition: '>',
    userEmail: '',
    lastValue: undefined
  });
  const [useCoordinates, setUseCoordinates] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});

  // Initialize form with alert data when opened
  useEffect(() => {
    if (alert && open) {
      setIsLoading(true);
      
      // Simulate loading delay for better UX
      const timer = setTimeout(() => {
        setEditedAlert({
          name: alert.name,
          description: alert.description || '',
          location: alert.location,
          parameter: alert.parameter,
          threshold: alert.threshold,
          condition: alert.condition,
          userEmail: alert.userEmail,
          lastValue: alert.lastValue
        });
        
        // Set location type
        setUseCoordinates(!!alert.location.coordinates);
        setIsLoading(false);
        
        // Reset touched states
        setFormTouched({});
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [alert, open]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (!name) return;
    
    // Mark field as touched
    setFormTouched({
      ...formTouched,
      [name]: true
    });
    
    if (name === 'lat' || name === 'lon') {
      setEditedAlert({
        ...editedAlert,
        location: {
          ...editedAlert.location,
          coordinates: {
            ...(editedAlert.location?.coordinates || { lat: 0, lon: 0 }),
            [name]: Number(value)
          }
        }
      });
    } else if (name === 'city') {
      setEditedAlert({
        ...editedAlert,
        location: { city: value as string }
      });
    } else {
      setEditedAlert({
        ...editedAlert,
        [name]: value
      });
    }
    
    // Validate field as user types
    validateField(name, value);
  };

  // Validate a single field
  const validateField = (name: string, value: unknown): boolean => {
    let error: string | null = null;
    
    switch (name) {
      case 'name':
        if (!value || (typeof value === 'string' && !value.trim())) {
          error = 'Name is required';
        }
        break;
      case 'userEmail':
        if (!value || (typeof value === 'string' && !value.trim())) {
          error = 'Email is required for notifications';
        } else if (!/\S+@\S+\.\S+/.test(value as string)) {
          error = 'Email address is invalid';
        }
        break;
      case 'city':
        if (useCoordinates) break;
        if (!value || (typeof value === 'string' && !value.trim())) {
          error = 'City is required';
        }
        break;
      case 'lat':
        if (!useCoordinates) break;
        const lat = Number(value);
        if (isNaN(lat)) {
          error = 'Latitude must be a number';
        } else if (lat < -90 || lat > 90) {
          error = 'Latitude must be between -90 and 90';
        }
        break;
      case 'lon':
        if (!useCoordinates) break;
        const lon = Number(value);
        if (isNaN(lon)) {
          error = 'Longitude must be a number';
        } else if (lon < -180 || lon > 180) {
          error = 'Longitude must be between -180 and 180';
        }
        break;
    }
    
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return !error;
  };

  // Toggle between city and coordinates
  const handleLocationTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseCoordinates(e.target.checked);
    if (e.target.checked) {
      setEditedAlert({
        ...editedAlert,
        location: { coordinates: { lat: 0, lon: 0 } }
      });
    } else {
      setEditedAlert({
        ...editedAlert,
        location: { city: '' }
      });
    }
    
    // Reset location-related errors
    setFormErrors({
      ...formErrors,
      city: null,
      lat: null,
      lon: null
    });
  };

  // Validate form before submission
  const validateForm = () => {
    // Validate all fields
    const requiredFields = ['name', 'userEmail'];
    if (useCoordinates) {
      requiredFields.push('lat', 'lon');
    } else {
      requiredFields.push('city');
    }
    
    let isValid = true;
    
    // Mark all fields as touched
    const newTouched: Record<string, boolean> = {};
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    setFormTouched(newTouched);
    
    // Validate each field
    requiredFields.forEach(field => {
      let value;
      if (field === 'lat' || field === 'lon') {
        value = editedAlert.location?.coordinates?.[field as 'lat' | 'lon'];
      } else if (field === 'city') {
        value = editedAlert.location?.city;
      } else {
        value = editedAlert[field as keyof Partial<Alert>];
      }
      
      const fieldValid = validateField(field, value);
      if (!fieldValid) isValid = false;
    });
    
    return isValid;
  };

  // Submit updated alert
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);

      // Create update data without status-related fields 
      // (server recalculates isTriggered based on conditions)
      await onSubmit(alert.id, editedAlert);
      setSuccessMessage("Alert updated successfully!");
      
      // Close the modal immediately after successful update
      onClose();
    } catch (err) {
      console.error('Error updating alert:', err);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      TransitionProps={{
        timeout: 400
      }}
    >
      <DialogTitle className="alert-edit-dialog-title">Edit Alert: {alert?.name}</DialogTitle>
      
      <DialogContent className="alert-edit-dialog-content" sx={{ padding: '8px !important' }}>
        {isLoading ? (
          <FeedbackMessage type="loading" message="Loading alert data..." />
        ) : (
          <form onSubmit={handleSubmit} className="alert-edit-form">
            {successMessage && (
              <FeedbackMessage type="success" message={successMessage} />
            )}
            
            <Box className="form-field-animation-1">
              <Typography variant="subtitle1" className="alert-edit-section-title" gutterBottom>
                Basic Information
              </Typography>
              <AlertBasicInfo 
                name={editedAlert.name || ''}
                description={editedAlert.description || ''}
                userEmail={editedAlert.userEmail || ''}
                onInputChange={handleInputChange}
                formErrors={formErrors}
              />
            </Box>
            
            <Box className="form-field-animation-2">
              <Typography variant="subtitle1" className="alert-edit-section-title" gutterBottom>
                Location
              </Typography>
              <LocationInput 
                useCoordinates={useCoordinates}
                onLocationTypeChange={handleLocationTypeChange}
                location={editedAlert.location || { city: '' }}
                onInputChange={handleInputChange}
                formErrors={formErrors}
              />
            </Box>
            
            <Box className="form-field-animation-3">
              <Typography variant="subtitle1" className="alert-edit-section-title" gutterBottom>
                Alert Conditions
              </Typography>
              <AlertParameters 
                parameter={editedAlert.parameter || 'temperature'}
                condition={editedAlert.condition || '>'}
                threshold={editedAlert.threshold || 0}
                onInputChange={handleInputChange}
              />
            </Box>
          </form>
        )}
      </DialogContent>
      
      <DialogActions className="alert-edit-dialog-actions">
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          color="primary" 
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
          disabled={isSubmitting || isLoading}
          className="animate-fadeIn delay-200"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertEditForm; 