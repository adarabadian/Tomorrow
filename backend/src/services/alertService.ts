import { Alert, updateAlert } from '../models/Alert';
import { getCurrentWeather } from './weatherService';

export const evaluateAlert = async (alert: Alert): Promise<boolean> => {
  try {
    let location: { lat: number; lon: number } | { city: string };
    
    if (alert.location.coordinates) {
      location = {
        lat: alert.location.coordinates.lat,
        lon: alert.location.coordinates.lon
      };
    } else if (alert.location.city) {
      location = { city: alert.location.city };
    } else {
      throw new Error('Location must be specified with either coordinates or city');
    }

    const weather = await getCurrentWeather(location);
    
    const currentValue = Number(weather[alert.parameter as keyof typeof weather]);
    if (isNaN(currentValue)) {
      throw new Error(`Invalid weather parameter: ${alert.parameter}`);
    }

    let isTriggered = false;

    switch (alert.condition) {
      case '>':
        isTriggered = currentValue > alert.threshold;
        break;
      case '<':
        isTriggered = currentValue < alert.threshold;
        break;
      case '>=':
        isTriggered = currentValue >= alert.threshold;
        break;
      case '<=':
        isTriggered = currentValue <= alert.threshold;
        break;
      case '==':
        isTriggered = currentValue === alert.threshold;
        break;
    }

    if (isTriggered !== alert.isTriggered) {
      alert.isTriggered = isTriggered;
      alert.lastChecked = new Date();
      await updateAlert(alert.id, alert);
    }

    return isTriggered;
  } catch (error) {
    console.error('Error evaluating alert:', error);
    return false;
  }
}; 