import { Request, Response } from 'express';
import { validateAlertData } from '../validators/alertValidator';
import * as alertRepository from '../repositories/alertRepository';
import { evaluateAlert, checkAlertCondition } from '../services/alertService';

export const createAlert = async (req: Request, res: Response) => {
  try {
    const validation = validateAlertData(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });
    
    const isTriggered = await checkAlertCondition({
      ...req.body,
      lastChecked: new Date()
    });
    
    // Create alert with the correct triggered state
    const newAlert = {
      ...req.body,
      isTriggered,
      lastChecked: new Date()
    };
    
    const alert = await alertRepository.createAlert(newAlert);
    
    res.status(201).json({ ...alert });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
};

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await alertRepository.getAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

export const getAlertById = async (req: Request, res: Response) => {
  try {
    const alert = await alertRepository.getAlertById(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    console.error('Error fetching alert:', error);
    res.status(500).json({ error: 'Failed to fetch alert' });
  }
};

export const updateAlert = async (req: Request, res: Response) => {
  try {
    const { isTriggered, lastChecked, ...updateData } = req.body;
    
    // If updating critical fields, validate them
    if (updateData.location || updateData.parameter || 
        updateData.threshold !== undefined || updateData.condition) {
      
      // Get existing alert to merge with updates for validation
      const existingAlert = await alertRepository.getAlertById(req.params.id);
      if (!existingAlert) return res.status(404).json({ error: 'Alert not found' });
      
      const validation = validateAlertData({
        ...existingAlert,
        ...updateData
      });
      
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
    }
    
    const alert = await alertRepository.updateAlert(req.params.id, updateData);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const success = await alertRepository.deleteAlert(req.params.id);
    if (!success) return res.status(404).json({ error: 'Alert not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
};

export const evaluateAlertController = async (req: Request, res: Response) => {
  try {
    const alert = await alertRepository.getAlertById(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });

    const isTriggered = await evaluateAlert(alert);
    
    await alertRepository.updateAlert(alert.id, { 
      isTriggered, 
      lastChecked: new Date() 
    });
    
    res.json({
      id: alert.id,
      name: alert.name,
      isTriggered,
      lastChecked: new Date()
    });
  } catch (error) {
    console.error('Error evaluating alert:', error);
    res.status(500).json({ error: 'Failed to evaluate alert' });
  }
};

export const getTriggeredAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await alertRepository.getTriggeredAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching triggered alerts:', error);
    res.status(500).json({ error: 'Failed to fetch triggered alerts' });
  }
};
