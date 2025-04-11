/**
 * Alert model representing a weather alert
 */
export interface Alert {
  id: string;
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
  condition: '>' | '<' | '>=' | '<=' | '==';
  description?: string;
  isTriggered: boolean;
  lastChecked: Date;
  createdAt: Date;
  updatedAt: Date;
  userEmail: string;
}
