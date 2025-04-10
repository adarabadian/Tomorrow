import { pool } from '../config/database';
import { Alert } from '../models/Alert';

/**
 * Maps a database row to an Alert object
 */
const mapRowToAlert = (row: any): Alert => ({
  id: row.id,
  name: row.name,
  location: row.location,
  parameter: row.parameter,
  threshold: row.threshold,
  condition: row.condition,
  description: row.description,
  isTriggered: row.is_triggered,
  lastChecked: row.last_checked,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  userEmail: row.user_email
});

/**
 * Creates a new alert in the database
 */
export const createAlert = async (alert: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>): Promise<Alert> => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO alerts (
        name, location, parameter, threshold, condition, 
        description, is_triggered, last_checked, user_email
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        alert.name, alert.location, alert.parameter, alert.threshold, alert.condition,
        alert.description, alert.isTriggered, alert.lastChecked, alert.userEmail
      ]
    );
    return mapRowToAlert(rows[0]);
  } catch (error) {
    console.error(`Error creating alert:`, error);
    throw error;
  }
};

/**
 * Retrieves all alerts from the database
 */
export const getAlerts = async (): Promise<Alert[]> => {
  try {
    const { rows } = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC');
    return rows.map(mapRowToAlert);
  } catch (error) {
    console.error(`Error getting alerts:`, error);
    return [];
  }
};

/**
 * Retrieves a single alert by ID
 */
export const getAlertById = async (id: string): Promise<Alert | null> => {
  try {
    const { rows } = await pool.query('SELECT * FROM alerts WHERE id = $1', [id]);
    return rows.length ? mapRowToAlert(rows[0]) : null;
  } catch (error) {
    console.error(`Error getting alert by id ${id}:`, error);
    return null;
  }
};

/**
 * Updates an existing alert
 */
export const updateAlert = async (id: string, alert: Partial<Alert>): Promise<Alert | null> => {
  try {
    const { rows } = await pool.query(
      `UPDATE alerts 
       SET name = COALESCE($1, name),
           location = COALESCE($2, location),
           parameter = COALESCE($3, parameter),
           threshold = COALESCE($4, threshold),
           condition = COALESCE($5, condition),
           description = COALESCE($6, description),
           is_triggered = COALESCE($7, is_triggered),
           last_checked = COALESCE($8, last_checked),
           user_email = COALESCE($9, user_email),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [
        alert.name, alert.location, alert.parameter, alert.threshold, alert.condition,
        alert.description, alert.isTriggered, alert.lastChecked, alert.userEmail, id
      ]
    );
    return rows.length ? mapRowToAlert(rows[0]) : null;
  } catch (error) {
    console.error(`Error updating alert ${id}:`, error);
    return null;
  }
};

/**
 * Deletes an alert from the database
 */
export const deleteAlert = async (id: string): Promise<boolean> => {
  try {
    const result = await pool.query('DELETE FROM alerts WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  } catch (error) {
    console.error(`Error deleting alert ${id}:`, error);
    return false;
  }
};

/**
 * Gets all alerts that are currently triggered
 */
export const getTriggeredAlerts = async (): Promise<Alert[]> => {
  try {
    const { rows } = await pool.query('SELECT * FROM alerts WHERE is_triggered = true ORDER BY last_checked DESC');
    return rows.map(mapRowToAlert);
  } catch (error) {
    console.error(`Error getting triggered alerts:`, error);
    return [];
  }
};

/**
 * Gets alerts for a specific user by email
 */
export const getAlertsByUserEmail = async (email: string): Promise<Alert[]> => {
  try {
    const { rows } = await pool.query('SELECT * FROM alerts WHERE user_email = $1 ORDER BY created_at DESC', [email]);
    return rows.map(mapRowToAlert);
  } catch (error) {
    console.error(`Error getting alerts for user ${email}:`, error);
    return [];
  }
}; 