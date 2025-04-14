import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { createAlert, deleteAlert, updateAlert } from '../services/alertService';
import { useAlerts } from '../contexts/AlertsContext';
import { Alert } from '../types/alert';

// Import our components
import AlertForm from '../components/AlertForm/AlertForm';
import AlertList from '../components/AlertList/AlertList';
import AlertEditForm from '../components/AlertEditForm/AlertEditForm';
import Notifications from '../components/Notifications/Notifications';

const Alerts: React.FC = () => {
  const { alerts, loading, error, refreshAlerts } = useAlerts();
  
  // State for UI feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [alertToEdit, setAlertToEdit] = useState<Alert | null>(null);

  // Handle alert creation
  const handleCreateAlert = async (alertData: any) => {
    try {
      const createdAlert = await createAlert(alertData);
      setSuccessMessage(`Alert for ${createdAlert.resolvedLocation || alertData.location.city || 'your location'} created successfully!`);
      refreshAlerts();
      return Promise.resolve();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create alert';
      setErrorMessage(errorMessage);
      return Promise.reject(err);
    }
  };

  // Edit an alert - called from AlertList
  const handleEditAlert = async (id: string): Promise<void> => {
    const alertToEdit = alerts.find(alert => alert.id === id || alert._id === id);
    if (alertToEdit) {
      setAlertToEdit(alertToEdit);
      setEditDialogOpen(true);
    }
    return Promise.resolve();
  };

  // Handle alert update submission
  const handleUpdateAlert = async (id: string, updatedData: Partial<Alert>): Promise<void> => {
    try {
      console.log('Updating alert:', id);
      console.log('With data:', updatedData);
      
      // Update the alert on the server
      const updatedAlert = await updateAlert(id, updatedData);
      console.log('Server response:', updatedAlert);
      
      // Explicitly refresh alerts to get the latest data with updated status
      console.log('Refreshing alerts...');
      await refreshAlerts();
      
      // Show success message
      setSuccessMessage('Alert updated successfully!');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update alert';
      console.error('Error updating alert:', errorMessage);
      setErrorMessage(errorMessage);
    }
  };

  // Delete an alert - returns a Promise for the AlertList component
  const handleDeleteAlert = async (id: string): Promise<void> => {
    try {
      await deleteAlert(id);
      setSuccessMessage('Alert deleted successfully!');
      await refreshAlerts();
      return Promise.resolve();
    } catch (err) {
      setErrorMessage('Failed to delete alert');
      return Promise.reject(err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Weather Alerts
      </Typography>
      
      {/* Alert Creation Form */}
      <AlertForm 
        onSubmit={handleCreateAlert}
        onSuccess={() => {}}
      />
      
      {/* Alert List */}
      <AlertList 
        alerts={alerts}
        loading={loading}
        error={error}
        onDelete={handleDeleteAlert}
        onEdit={handleEditAlert}
        onRefresh={refreshAlerts}
      />
      
      {/* Edit Dialog */}
      {alertToEdit && (
        <AlertEditForm
          alert={alertToEdit}
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setAlertToEdit(null);
          }}
          onSubmit={handleUpdateAlert}
        />
      )}
      
      {/* Notifications */}
      <Notifications 
        successMessage={successMessage}
        errorMessage={errorMessage}
        onClearSuccess={() => setSuccessMessage(null)}
        onClearError={() => setErrorMessage(null)}
      />
    </Box>
  );
};

export default Alerts; 