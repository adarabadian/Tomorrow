import { Request, Response } from 'express';
import * as alertRepository from '../repositories/alertRepository';
import { 
  updateAlertWithValidation,
  createAlertWithValidation,
  evaluateAlertById
} from '../services/alertService';

/**
 * Handle service errors (validation and location errors) with proper status codes
 */
const handleServiceError = (res: Response, error: any): boolean => {
  if (error.name === 'ValidationError' || error.name === 'LocationError') {
    res.status(400).json({ error: error.message });
    return true; // Error was handled
  }
  return false; // Not handled
};

/**
 * Standard error handler for controllers
 */
const handleError = (res: Response, error: any, message: string): void => {
  console.error(message, error);
  res.status(500).json({ error: message });
};

export const createAlert = async (req: Request, res: Response) => {
  try {
    try {
      const alert = await createAlertWithValidation(req.body);
      res.status(201).json(alert);
    } catch (error: any) {
      if (handleServiceError(res, error)) return;
      throw error;
    }
  } catch (error) {
    handleError(res, error, 'Failed to create alert');
  }
};

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await alertRepository.getAlerts();
    res.json(alerts);
  } catch (error) {
    handleError(res, error, 'Failed to fetch alerts');
  }
};

export const getAlertById = async (req: Request, res: Response) => {
  try {
    const alert = await alertRepository.getAlertById(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    handleError(res, error, 'Failed to fetch alert');
  }
};

export const updateAlert = async (req: Request, res: Response) => {
  try {
    const { isTriggered, lastChecked, ...updateData } = req.body;
    
    try {
      const updatedAlert = await updateAlertWithValidation(req.params.id, updateData);
      if (!updatedAlert) return res.status(404).json({ error: 'Alert not found' });
      res.json(updatedAlert);
    } catch (error: any) {
      if (handleServiceError(res, error)) return;
      throw error;
    }
  } catch (error) {
    handleError(res, error, 'Failed to update alert');
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const success = await alertRepository.deleteAlert(req.params.id);
    if (!success) return res.status(404).json({ error: 'Alert not found' });
    res.status(204).send();
  } catch (error) {
    handleError(res, error, 'Failed to delete alert');
  }
};

export const evaluateAlertController = async (req: Request, res: Response) => {
  try {
    const result = await evaluateAlertById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Alert not found' });
    res.json(result);
  } catch (error) {
    handleError(res, error, 'Failed to evaluate alert');
  }
};

export const getTriggeredAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await alertRepository.getTriggeredAlerts();
    res.json(alerts);
  } catch (error) {
    handleError(res, error, 'Failed to fetch triggered alerts');
  }
};

export const getFailedFetchAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await alertRepository.getAlertsWithFailedFetches();
    res.json(alerts);
  } catch (error) {
    handleError(res, error, 'Failed to fetch alerts with failed fetches');
  }
};
