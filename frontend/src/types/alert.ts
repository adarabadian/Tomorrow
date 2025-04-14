export interface Alert {
  id: string;
  _id: string; // MongoDB-style ID for compatibility
  name: string;
  location: {
    city?: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
  };
  resolvedLocation?: string;
  parameter: string;
  threshold: number;
  condition: string;
  userEmail: string;
  description?: string;
  status: 'active' | 'inactive';
  isTriggered: boolean;
  lastChecked: string;
  lastValue?: number;
}

export interface CreateAlertPayload {
  name: string;
  location: {
    city?: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
  };
  parameter: string;
  threshold: number;
  condition: string;
  description?: string;
  userEmail: string;
}

export interface AlertSummary {
  id: string;
  name: string;
  parameter: string;
  isTriggered: boolean;
}

// Helper function to map the backend Alert model to our frontend Alert model
export const mapBackendAlert = (backendAlert: any): Alert => {
  return {
    id: backendAlert.id || backendAlert._id,
    _id: backendAlert._id || backendAlert.id,
    name: backendAlert.name,
    location: backendAlert.location,
    resolvedLocation: backendAlert.resolvedLocation,
    parameter: backendAlert.parameter,
    threshold: backendAlert.threshold,
    condition: backendAlert.condition,
    description: backendAlert.description,
    userEmail: backendAlert.userEmail || '',
    status: backendAlert.status || (backendAlert.isTriggered ? 'active' : 'inactive'),
    isTriggered: backendAlert.isTriggered || false,
    lastChecked: backendAlert.lastChecked || new Date().toISOString(),
    lastValue: backendAlert.lastValue
  };
}; 