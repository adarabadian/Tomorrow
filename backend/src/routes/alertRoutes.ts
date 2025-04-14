import express from 'express';
import * as alertController from '../controllers/alertController';

const router = express.Router();

// Get all alerts
router.get('/', alertController.getAlerts);

// Get a specific alert
router.get('/:id', alertController.getAlertById);

// Create a new alert
router.post('/', alertController.createAlert);

// Update an alert
router.put('/:id', alertController.updateAlert);

// Delete an alert
router.delete('/:id', alertController.deleteAlert);

// Evaluate an alert
router.get('/:id/evaluate', alertController.evaluateAlertController);

// Get triggered alerts
router.get('/status/triggered', alertController.getTriggeredAlerts);

export default router; 