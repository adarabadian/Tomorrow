import React, { useState } from 'react';
import { 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Alert as MuiAlert
} from '@mui/material';
import AlertCard from '../AlertCard/AlertCard';
import DeleteAlertDialog from '../DeleteAlertDialog/DeleteAlertDialog';
import { Alert } from '../../types/alert';

interface AlertListProps {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (id: string) => Promise<void>;
  onRefresh?: () => void;
}

const AlertList: React.FC<AlertListProps> = ({ 
  alerts, 
  loading, 
  error, 
  onDelete,
  onEdit,
  onRefresh
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const handleDeleteClick = (alertId: string) => {
    setSelectedAlertId(alertId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAlertId) return;
    
    setDeleteInProgress(true);
    try {
      await onDelete(selectedAlertId);
    } catch (err) {
      console.error('Error deleting alert:', err);
    } finally {
      setDeleteInProgress(false);
      setDeleteDialogOpen(false);
      setSelectedAlertId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedAlertId(null);
  };

  // Loading state
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        my={4}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <MuiAlert 
        severity="error" 
        sx={{ my: 2 }}
      >
        {error}
      </MuiAlert>
    );
  }

  // Empty state
  if (alerts.length === 0) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        my={4}
        p={3}
        border={1}
        borderColor="divider"
        borderRadius={1}
      >
        <Typography variant="h6" align="center" gutterBottom>
          No Alerts Yet
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          Create your first weather alert using the form above.
        </Typography>
      </Box>
    );
  }

  // Display alerts
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Your Alerts ({alerts.length})
      </Typography>
      <Grid container spacing={3}>
        {alerts.map(alert => (
          <Grid item xs={12} md={6} lg={4} key={alert.id || alert._id}>
            <AlertCard 
              alert={alert} 
              onDelete={() => handleDeleteClick(alert.id || alert._id)}
              onEdit={onEdit ? () => onEdit(alert.id || alert._id) : undefined}
            />
          </Grid>
        ))}
      </Grid>

      <DeleteAlertDialog
        open={deleteDialogOpen}
        loading={deleteInProgress}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
    </>
  );
};

export default AlertList; 