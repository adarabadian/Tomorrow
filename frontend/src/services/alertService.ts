import axios from 'axios';
import { Alert } from '../types/weather';

const API_BASE_URL = 'http://localhost:3001/api';

export const getAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alerts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw new Error('Failed to fetch alerts');
  }
};

export const createAlert = async (alert: Alert): Promise<Alert> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/alerts`, alert);
    return response.data;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw new Error('Failed to create alert');
  }
};

export const deleteAlert = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/alerts/${id}`);
  } catch (error) {
    console.error('Error deleting alert:', error);
    throw new Error('Failed to delete alert');
  }
}; 