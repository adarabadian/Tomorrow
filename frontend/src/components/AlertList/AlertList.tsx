import React, { useState, useMemo } from 'react';
import { 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Alert as MuiAlert,
  ToggleButtonGroup,
  ToggleButton,
  Stack
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import TextFieldsIcon from '@mui/icons-material/TextFields';
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

// Sort options
type SortOption = 'triggered' | 'name';

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
  const [sortBy, setSortBy] = useState<SortOption>('triggered');

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

  // Handle sort option change
  const handleSortChange = (
    event: React.MouseEvent<HTMLElement>,
    newSortBy: SortOption | null,
  ) => {
    if (newSortBy !== null) {
      setSortBy(newSortBy);
    }
  };

  // Sort alerts based on current sort settings
  const sortedAlerts = useMemo(() => {
    return [...alerts].sort((a, b) => {
      if (sortBy === 'triggered') {
        // Sort by triggered status - triggered first
        return a.isTriggered === b.isTriggered ? 0 : a.isTriggered ? -1 : 1;
      } else {
        // Sort by name - alphabetical (A-Z)
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB);
      }
    });
  }, [alerts, sortBy]);

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Your Alerts ({alerts.length})
        </Typography>
        
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="textSecondary">
            Sort by:
          </Typography>
          <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={handleSortChange}
            size="small"
            aria-label="sort options"
          >
            <ToggleButton value="triggered" aria-label="sort by triggered status">
              <NotificationsActiveIcon fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                Triggered first
              </Typography>
            </ToggleButton>
            <ToggleButton value="name" aria-label="sort by name">
              <TextFieldsIcon fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                A-Z
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>
      
      <Grid container spacing={3}>
        {sortedAlerts.map(alert => (
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