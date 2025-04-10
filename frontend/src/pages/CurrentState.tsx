import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Alert } from '../types/weather';
import { getAlerts } from '../services/alertService';

const CurrentState: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await getAlerts();
        setAlerts(data);
      } catch (err) {
        setError('Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
    const interval = setInterval(loadAlerts, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const triggeredAlerts = alerts.filter((alert) => alert.isTriggered);
  const activeAlerts = alerts.filter((alert) => !alert.isTriggered);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Alert Status
      </Typography>

      {triggeredAlerts.length > 0 ? (
        <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: '#ffebee' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Active Alerts ({triggeredAlerts.length})
          </Typography>
          <List>
            {triggeredAlerts.map((alert) => (
              <ListItem key={alert.id}>
                <ListItemText
                  primary={alert.name}
                  secondary={`${alert.parameter} ${alert.condition} ${alert.threshold}°C`}
                />
                <Chip label="Triggered" color="error" />
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: '#e8f5e9' }}>
          <Typography variant="h6" color="success.main" align="center">
            All Clear - No Active Alerts
          </Typography>
        </Paper>
      )}

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Inactive Alerts ({activeAlerts.length})
        </Typography>
        <List>
          {activeAlerts.map((alert) => (
            <ListItem key={alert.id}>
              <ListItemText
                primary={alert.name}
                secondary={`${alert.parameter} ${alert.condition} ${alert.threshold}°C`}
              />
              <Chip label="Normal" color="success" />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CurrentState; 