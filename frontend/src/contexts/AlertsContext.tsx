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
      const data = await getAlerts();
      setAlerts(data);
      setLastUpdated(new Date());
    } catch (err) {
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