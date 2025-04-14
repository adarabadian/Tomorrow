import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Alert } from '../../types/alert';

interface AlertStatusOverviewProps {
  alerts: Alert[];
  lastUpdated: Date | null;
}

const AlertStatusOverview: React.FC<AlertStatusOverviewProps> = ({ alerts, lastUpdated }) => {
  const totalAlerts = alerts.length;
  const triggeredAlerts = alerts.filter(alert => alert.isTriggered);
  const normalAlerts = totalAlerts - triggeredAlerts.length;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" gutterBottom>
            Alert Status Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Total Alerts: {totalAlerts}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Active Alerts: {triggeredAlerts.length}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Normal Alerts: {normalAlerts}
          </Typography>
        </Box>
        {lastUpdated && (
          <Typography variant="body2" color="text.secondary">
            Last Updated: {lastUpdated.toLocaleString()}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default AlertStatusOverview; 