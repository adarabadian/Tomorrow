import { Request, Response } from 'express';
import { createAlert, getAlerts, getAlertById, updateAlert, deleteAlert } from '../models/Alert';
import { evaluateAlert } from '../services/alertService';

export const createAlertController = async (req: Request, res: Response) => {
  try {
    // Create the alert
    const alert = await createAlert(req.body);
    
    // Evaluate the alert immediately
    const isTriggered = await evaluateAlert(alert);
    
    // Return both the alert and its current state
    res.status(201).json({
      ...alert,
      isTriggered,
      lastChecked: new Date()
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
};

export const getAlertsController = async (req: Request, res: Response) => {
  try {
    const alerts = await getAlerts();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

export const getAlertByIdController = async (req: Request, res: Response) => {
  try {
    const alert = await getAlertById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alert' });
  }
};

export const updateAlertController = async (req: Request, res: Response) => {
  try {
    const alert = await updateAlert(req.params.id, req.body);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
};

export const deleteAlertController = async (req: Request, res: Response) => {
  try {
    const success = await deleteAlert(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete alert' });
  }
};

export const evaluateAlertController = async (req: Request, res: Response) => {
  try {
    const alert = await getAlertById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const result = await evaluateAlert(alert);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to evaluate alert' });
  }
}; 