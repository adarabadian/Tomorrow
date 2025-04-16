import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from '../types/alert';
import { getAlerts } from '../services/alertService';
import { Snackbar, Alert as MuiAlert } from '@mui/material';

interface AlertsContextType {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  refreshAlerts: () => Promise<void>;
  lastUpdated: Date | null;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export const AlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [notification, setNotification] = useState<{ message: string, id: string } | null>(null);
  const previousAlertsRef = useRef<Alert[]>([]);

  // Check for newly triggered alerts and show notification
  const checkForNewlyTriggeredAlerts = useCallback((newAlerts: Alert[]) => {
    if (previousAlertsRef.current.length === 0) return;
    const newlyTriggered = getNewlyTriggeredAlerts(previousAlertsRef.current, newAlerts);
    if (newlyTriggered.length > 0) handleNewlyTriggeredAlerts(newlyTriggered);
  }, []);

  const getNewlyTriggeredAlerts = (previousAlerts: Alert[], newAlerts: Alert[]): Alert[] => {
    return newAlerts.filter(newAlert => 
      newAlert.isTriggered && 
      !previousAlertsRef.current.some(oldAlert => 
        oldAlert.id === newAlert.id && oldAlert.isTriggered
      )
    );
  };

  const handleNewlyTriggeredAlerts = (newlyTriggered: Alert[]) => {
    const triggerAlert = newlyTriggered[0];
    setNotification({
      message: `Alert: "${triggerAlert.name}" has been triggered!`,
      id: triggerAlert.id
    });
  };

  // Update state with new alerts data
  const updateAlertsState = useCallback((data: Alert[]) => {
    previousAlertsRef.current = data;
    setAlerts(data);
    setLastUpdated(new Date());
  }, []);

  // Handle fetch errors
  const handleFetchError = useCallback((err: unknown) => {
    console.error('Failed to load alerts:', err);
    setError('Failed to load alerts');
  }, []);

  // Preserve scroll position during updates
  const preserveScrollPosition = useCallback((callback: () => Promise<void>) => {
    const scrollPosition = window.scrollY;
    
    return callback().finally(() => {
      window.setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
    });
  }, []);

  // Process alerts data from server
  const processAlertsData = useCallback((data: unknown) => {
    if (data && Array.isArray(data)) {
      checkForNewlyTriggeredAlerts(data);
      updateAlertsState(data);
    } else {
      console.error('Invalid alert data received:', data);
      setError('Failed to process alert data');
    }
  }, [checkForNewlyTriggeredAlerts, updateAlertsState]);

  // Main refresh function
  const refreshAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    return preserveScrollPosition(async () => {
      try {
        const data = await getAlerts();
        processAlertsData(data);
      } catch (err) {
        handleFetchError(err);
      } finally {
        setLoading(false);
      }
    });
  }, [processAlertsData, handleFetchError, preserveScrollPosition]);

  // Initial load
  useEffect(() => {
    refreshAlerts();
  }, [refreshAlerts]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshAlerts, 30000);
    return () => clearInterval(interval);
  }, [refreshAlerts]);

  // Clear notification after 6 seconds
  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <AlertsContext.Provider value={{ alerts, loading, error, refreshAlerts, lastUpdated }}>
      {children}
      
      {/* Alert notification */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={handleCloseNotification}
          severity="warning"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification?.message || ''}
        </MuiAlert>
      </Snackbar>
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (context === undefined) throw new Error('useAlerts must be used within an AlertsProvider');
  return context;
}; 