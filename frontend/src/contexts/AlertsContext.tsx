import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from '../types/alert';
import { getAlerts } from '../services/alertService';

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

  const refreshAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Refreshing alerts from server...');
      // Force-fetch the latest data from the server
      const data = await getAlerts();
      console.log('Got alerts from server:', data);
      
      // Map the alerts to ensure isTriggered is correctly calculated
      if (data && Array.isArray(data)) {
        console.log(`Processed ${data.length} alerts with recalculated status`);
        setAlerts(data);
        setLastUpdated(new Date());
      } else {
        console.error('Invalid alert data received:', data);
        setError('Failed to process alert data');
      }
    } catch (err) {
      console.error('Failed to load alerts:', err);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshAlerts();
  }, [refreshAlerts]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshAlerts, 30000);
    return () => clearInterval(interval);
  }, [refreshAlerts]);

  return (
    <AlertsContext.Provider value={{ alerts, loading, error, refreshAlerts, lastUpdated }}>
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
}; 