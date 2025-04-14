import axios from 'axios';
import { Alert, mapBackendAlert } from '../types/alert';

const API_BASE_URL = 'http://localhost:3001/api';

// Type for creating a new alert
export type CreateAlertPayload = Omit<Alert, 'id' | '_id' | 'isTriggered' | 'lastChecked' | 'status'>;

/**
 * Get all alerts from the API
 * @returns List of alerts
 */
export const getAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alerts`);
    return response.data.map((alert: any) => mapBackendAlert(alert));
  } catch (error) {
    throw new Error('Failed to fetch alerts');
  }
};

/**
 * Create a new alert
 * @param alert Alert data to create
 * @returns The created alert
 */
export const createAlert = async (alert: CreateAlertPayload): Promise<Alert> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/alerts`, alert);
    return mapBackendAlert(response.data);
  } catch (error: any) {
    // Pass the specific error message from the backend if available
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error; // Rethrow the original error with details
  }
};

/**
 * Delete an alert by ID
 * @param id Alert ID to delete
 */
export const deleteAlert = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/alerts/${id}`);
  } catch (error) {
    throw new Error('Failed to delete alert');
  }
};

/**
 * Update an existing alert
 * @param id Alert ID to update
 * @param alert Partial alert data to update
 * @returns The updated alert
 */
export const updateAlert = async (id: string, alert: Partial<Alert>): Promise<Alert> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/alerts/${id}`, alert);
    return mapBackendAlert(response.data);
  } catch (error: any) {
    // Pass the specific error message from the backend if available
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error; // Rethrow the original error with details
  }
}; 