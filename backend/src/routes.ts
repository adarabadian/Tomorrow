import { Application, Router } from 'express';
import { 
  createAlert, 
  getAlerts, 
  getAlertById, 
  updateAlert, 
  deleteAlert, 
  evaluateAlertController,
  getTriggeredAlerts,
  getFailedFetchAlerts
} from './controllers/alertController';
import { 
  handleCurrentWeatherRequest, 
  handleDefaultLocationWeatherRequest,
  handleCacheStatusRequest,
  handleClearCacheRequest
} from './controllers/weatherController';

/**
 * Setup all API routes
 */
export const setupRoutes = (app: Application): void => {
  const router = Router();
  
  // Alert routes
  router.post('/alerts', createAlert);
  router.get('/alerts', getAlerts);
  router.get('/alerts/triggered', getTriggeredAlerts);
  router.get('/alerts/failed-fetches', getFailedFetchAlerts);
  router.get('/alerts/:id', getAlertById);
  router.put('/alerts/:id', updateAlert);
  router.delete('/alerts/:id', deleteAlert);
  router.post('/alerts/:id/evaluate', evaluateAlertController);
  
  // Weather routes
  router.get('/weather/current', handleCurrentWeatherRequest);
  router.get('/weather/default', handleDefaultLocationWeatherRequest);
  
  // Cache management routes (can be protected with admin middleware in production)
  router.get('/weather/cache/status', handleCacheStatusRequest);
  router.delete('/weather/cache', handleClearCacheRequest);
  
  // Apply API prefix
  app.use('/api', router);
}; 