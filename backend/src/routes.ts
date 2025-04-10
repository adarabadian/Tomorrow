import { Application, Router } from 'express';
import { 
  createAlert, 
  getAlerts, 
  getAlertById, 
  updateAlert, 
  deleteAlert, 
  evaluateAlertController,
  getTriggeredAlerts
} from './controllers/alertController';
import { handleCurrentWeatherRequest } from './controllers/weatherController';

/**
 * Setup all API routes
 */
export const setupRoutes = (app: Application): void => {
  const router = Router();
  
  // Alert routes
  router.post('/alerts', createAlert);
  router.get('/alerts', getAlerts);
  router.get('/alerts/triggered', getTriggeredAlerts);
  router.get('/alerts/:id', getAlertById);
  router.put('/alerts/:id', updateAlert);
  router.delete('/alerts/:id', deleteAlert);
  router.post('/alerts/:id/evaluate', evaluateAlertController);
  
  // Weather routes
  router.get('/weather/current', handleCurrentWeatherRequest);
  
  // Apply API prefix
  app.use('/api', router);
}; 