import express from 'express';
import * as alertController from '../controllers/alertController';

const router = express.Router();

// Get all alerts
router.get('/', alertController.getAlerts);

// Create a new alert
router.post('/', alertController.createAlert);

// Update an alert
router.put('/:id', alertController.updateAlert);

// Delete an alert
router.delete('/:id', alertController.deleteAlert);

export default router; 