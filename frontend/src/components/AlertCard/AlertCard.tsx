import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import EmailIcon from '@mui/icons-material/Email';
import { Alert } from '../../types/alert';
import { 
  getConditionText, 
  getParameterName, 
  getParameterUnit,
  getParameterIcon
} from '../../utils/alertUtils';
import './AlertCard.css';
import '../Animations.css';

interface AlertCardProps {
  alert: Alert;
  onDelete: () => void;
  onEdit?: () => void;
  onToggleStatus?: () => void;
}

const AlertCard = ({ alert, onDelete, onEdit, onToggleStatus }: AlertCardProps) => {
  const { 
    name, 
    parameter, 
    condition, 
    threshold, 
    location, 
    status,
    isTriggered,
    resolvedLocation,
    userEmail
  } = alert;

  // Memoize location string to avoid recalculation on re-renders
  const locationString = useMemo(() => {
    if (resolvedLocation) return resolvedLocation;
    
    if (location.city) {
      return location.city;
    } else if (location.coordinates) {
      return `Lat: ${location.coordinates.lat.toFixed(2)}, Lon: ${location.coordinates.lon.toFixed(2)}`;
    }
    return 'No location specified';
  }, [resolvedLocation, location]);

  // Determine the active status
  const isActive = status === 'active' || isTriggered;
  const parameterIcon = getParameterIcon(parameter);

  return (
    <Card 
      className={`alert-card ${isActive ? 'alert-card-active' : 'alert-card-inactive'} alert-card-appear`}
      elevation={2}
    >
      <CardContent className="alert-card-content">
        <Box className="alert-card-header">
          <Typography variant="h6" fontWeight="bold">
            {name}
          </Typography>
          <Chip
            label={isActive ? 'Active' : 'Inactive'}
            color={isActive ? 'success' : 'default'}
            size="small"
            className="animate-fadeIn"
          />
        </Box>

        <Divider className="alert-card-divider" />

        <Box className="alert-card-location">
          <LocationOnIcon className="alert-card-icon" fontSize="small" />
          <Typography variant="body2">
            {locationString}
          </Typography>
        </Box>

        <Box className="alert-card-email">
          <EmailIcon className="alert-card-icon" fontSize="small" />
          <Typography variant="body2">
            Notifications to: {userEmail}
          </Typography>
        </Box>

        <Box className="alert-card-condition">
          <Box className="alert-card-icon">
            {parameterIcon}
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="medium">
              Alert Condition:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getParameterName(parameter)} is {getConditionText(condition)} {threshold}{getParameterUnit(parameter)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions className="alert-card-actions">
        <Box>
          {onToggleStatus && (
            <Tooltip title={isActive ? 'Deactivate Alert' : 'Activate Alert'}>
              <IconButton 
                onClick={onToggleStatus} 
                color={isActive ? 'success' : 'default'}
                aria-label={isActive ? 'Deactivate Alert' : 'Activate Alert'}
                className="alert-card-button"
              >
                {isActive ? <NotificationsActiveIcon /> : <NotificationsOffIcon />}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Edit Alert">
            <IconButton 
              onClick={onEdit} 
              color="primary"
              aria-label="Edit Alert"
              className="alert-card-button"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip title="Delete Alert">
          <IconButton 
            onClick={onDelete} 
            color="error"
            aria-label="Delete Alert"
            className="alert-card-button"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default React.memo(AlertCard); 