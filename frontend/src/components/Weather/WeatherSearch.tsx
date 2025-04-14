import React, { useState } from 'react';
import {
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';

interface WeatherSearchProps {
  initialLocation?: string;
  onSearch: (location: { city: string } | { lat: number; lon: number }) => void;
  onGetCurrentLocation: () => void;
}

const WeatherSearch: React.FC<WeatherSearchProps> = ({ 
  initialLocation = '',
  onSearch,
  onGetCurrentLocation
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [location, setLocation] = useState<string>(initialLocation);

  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    
    // Check if input looks like coordinates (lat,lon)
    const coordMatch = location.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
    if (!coordMatch) return onSearch({ city: location.trim() });

    const lat = parseFloat(coordMatch[1]);
    const lon = parseFloat(coordMatch[3]);
    
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      // Invalid coordinates handling is delegated to the parent component
      return;
    }
    
    onSearch({ lat, lon });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <form onSubmit={handleLocationSearch}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8} md={9}>
            <TextField
              fullWidth
              label="Enter City or Coordinates (lat,lon)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="e.g. London or 51.5074,-0.1278"
            />
          </Grid>
          <Grid item xs={6} sm={2} md={1.5}>
            <Button 
              variant="contained" 
              color="primary" 
              type="submit" 
              fullWidth
              startIcon={<SearchIcon />}
              sx={{ py: 1, height: '100%', minHeight: '42px', px: 5, minWidth: '120px' }}
            >
              {isMobile ? '' : 'Search'}
            </Button>
          </Grid>
          <Grid item xs={6} sm={2} md={1.5}>
            <Button
              variant="outlined"
              color="primary"
              onClick={onGetCurrentLocation}
              fullWidth
              startIcon={<MyLocationIcon />}
              sx={{ py: 1, height: '100%', minHeight: '42px', px: 5, minWidth: '120px' }}
            >
              {isMobile ? '' : 'Current'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default WeatherSearch; 