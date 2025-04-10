import { Express, Router } from 'express';
import { createAlertController, getAlertsController, getAlertByIdController, updateAlertController, deleteAlertController, evaluateAlertController } from './controllers/alertController';
import { handleCurrentWeatherRequest } from './controllers/weatherController';

const router = Router();

// Alert routes
router.post('/alerts', createAlertController);
router.get('/alerts', getAlertsController);
router.get('/alerts/:id', getAlertByIdController);
router.put('/alerts/:id', updateAlertController);
router.delete('/alerts/:id', deleteAlertController);
router.post('/alerts/:id/evaluate', evaluateAlertController);

// Weather routes
router.get('/weather/current', handleCurrentWeatherRequest);

export const setupRoutes = (app: Express) => {
  app.use('/api', router);
}; 