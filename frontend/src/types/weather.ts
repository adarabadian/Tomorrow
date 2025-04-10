export interface WeatherData {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  humidity: number;
  timestamp: string;
}

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
  lastChecked: string;
} 