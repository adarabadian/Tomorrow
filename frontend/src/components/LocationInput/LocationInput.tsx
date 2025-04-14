import React from 'react';
import { Grid, TextField, FormControlLabel, Switch } from '@mui/material';
import { CreateAlertPayload } from '../../types/alert';
import '../Animations.css';

interface LocationInputProps {
  useCoordinates: boolean;
  onLocationTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  location: CreateAlertPayload['location'];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formErrors: Record<string, string | null>;
}

const LocationInput: React.FC<LocationInputProps> = ({
  useCoordinates,
  onLocationTypeChange,
  location,
  onInputChange,
  formErrors
}) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={useCoordinates}
              onChange={onLocationTypeChange}
              color="primary"
            />
          }
          label="Use Coordinates Instead of City"
        />
      </Grid>
      
      {useCoordinates ? (
        <>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Latitude"
              name="lat"
              type="number"
              InputProps={{ inputProps: { min: -90, max: 90, step: 0.000001 } }}
              value={location?.coordinates?.lat || ''}
              onChange={onInputChange}
              error={!!formErrors.lat}
              helperText={formErrors.lat}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Longitude"
              name="lon"
              type="number"
              InputProps={{ inputProps: { min: -180, max: 180, step: 0.000001 } }}
              value={location?.coordinates?.lon || ''}
              onChange={onInputChange}
              error={!!formErrors.lon}
              helperText={formErrors.lon}
              required
            />
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={location?.city || ''}
            onChange={onInputChange}
            error={!!formErrors.city}
            helperText={formErrors.city}
            required
          />
        </Grid>
      )}
    </Grid>
  );
};

export default LocationInput; 