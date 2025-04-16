import { Request, Response } from 'express';
import * as alertRepository from '../repositories/alertRepository';
import { 
  updateAlertWithValidation,
  createAlertWithValidation
} from '../services/alertService';
import { handleServiceError, handleError } from '../utils/errorHandlers';

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

export const updateAlert = async (req: Request, res: Response) => {
  try {
    // Remove isTriggered and lastChecked from client updates
    // isTriggered is calculated by the business logic, not set directly
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
