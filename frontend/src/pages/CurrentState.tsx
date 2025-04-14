import React from 'react';
import { Box, Fade, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import { useAlerts } from '../contexts/AlertsContext';
import PageHeader from '../components/PageHeader/PageHeader';
import LoadingState from '../components/LoadingState/LoadingState';
import AlertStatusOverview from '../components/AlertStatusOverview/AlertStatusOverview';
import AlertStatusList from '../components/AlertList/AlertStatusList';

const CurrentState: React.FC = () => {
  const { alerts, loading, error, refreshAlerts, lastUpdated } = useAlerts();

  // Filter alerts by status
  const triggeredAlerts = alerts.filter(alert => alert.isTriggered);

  return (
    <Box>
      <PageHeader 
        title="Alert Status"
        action={{
          label: "Refresh",
          onClick: refreshAlerts,
          icon: <RefreshIcon />,
          loading: loading,
          disabled: loading
        }}
      />

      <LoadingState 
        loading={loading && alerts.length === 0} 
        error={error}
        isEmpty={alerts.length === 0 && !loading && !error}
        emptyMessage="No alerts have been created yet"
      >
        <Box sx={{ mb: 4 }}>
          <AlertStatusOverview 
            alerts={alerts} 
            lastUpdated={lastUpdated || new Date()} 
          />
        </Box>

        <Fade in={true}>
          <Box>
            <AlertStatusList
              alerts={triggeredAlerts}
              title="Active Alerts"
              icon={<WarningIcon />}
              borderColor="#f44336"
              backgroundColor="rgba(244, 67, 54, 0.05)"
            />

            {alerts.length > 0 && triggeredAlerts.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No active alerts at this time
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      </LoadingState>
    </Box>
  );
};

export default CurrentState; 