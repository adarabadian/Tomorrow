import { pool } from '../config/database';
import { Alert } from '../models/Alert';

/**
 * Database row type for Alert table
 */
interface AlertRow {
  id: string;
  name: string;
  location: any;
  parameter: string;
  threshold: number;
  condition: '>' | '<' | '>=' | '<=' | '==';
  description: string | null;
  is_triggered: boolean;
  last_checked: Date;
  created_at: Date;
  updated_at: Date;
  user_email: string;
  last_fetch_success: boolean;
  last_fetch_time: Date;
  last_value?: number;
  resolved_location: string | null;
}

/**
 * Maps a database row to an Alert object
 */
const mapRowToAlert = (row: AlertRow): Alert => ({
  id: row.id,
  name: row.name,
  location: row.location,
  parameter: row.parameter,
  threshold: row.threshold,
  condition: row.condition,
  description: row.description || undefined,
  isTriggered: row.is_triggered,
  lastChecked: row.last_checked,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  userEmail: row.user_email,
  lastFetchSuccess: row.last_fetch_success,
  lastFetchTime: row.last_fetch_time,
  lastValue: row.last_value,
  resolvedLocation: row.resolved_location || undefined
});

/**
 * Creates a new alert in the database
 */
export const createAlert = async (alert: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>): Promise<Alert> => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO alerts (
        name, location, parameter, threshold, condition, 
        description, is_triggered, last_checked, user_email, resolved_location, last_value
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        alert.name, alert.location, alert.parameter, alert.threshold, alert.condition,
        alert.description, alert.isTriggered, alert.lastChecked, alert.userEmail, alert.resolvedLocation, alert.lastValue
      ]
    );
    return mapRowToAlert(rows[0]);
  } catch (error) {
    console.error(`Error creating alert: ${error instanceof Error ? error.message : String(error)}`);
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
    console.error(`Error getting alerts: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
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
    console.error(`Error getting alert by id ${id}: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
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
           resolved_location = COALESCE($10, resolved_location),
           last_value = COALESCE($11, last_value),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [
        alert.name, alert.location, alert.parameter, alert.threshold, alert.condition,
        alert.description, alert.isTriggered, alert.lastChecked, alert.userEmail, 
        alert.resolvedLocation, alert.lastValue, id
      ]
    );
    
    if (!rows.length) return null;
    
    return mapRowToAlert(rows[0]);
  } catch (error) {
    console.error(`Error updating alert ${id}: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
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
    console.error(`Error deleting alert ${id}: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
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
    console.error(`Error getting alerts for user ${email}: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

/**
 * Updates the fetch status for alerts with the given location key
 */
export const updateLocationFetchStatus = async (
  locationKey: string,
  status: { success: boolean }
): Promise<void> => {
  try {
    await pool.query(
      `UPDATE alerts 
       SET last_fetch_success = $1,
           last_fetch_time = CURRENT_TIMESTAMP
       WHERE location->>'city' = $2 OR 
             resolved_location = $2`,
      [status.success, locationKey]
    );
  } catch (error) {
    console.error(`Error updating fetch status for location ${locationKey}: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

/**
 * Updates the resolved location for alerts with the given location key
 */
export const updateResolvedLocation = async (
  locationKey: string, 
  resolvedLocation: string
): Promise<void> => {
  try {
    await pool.query(
      `UPDATE alerts 
       SET resolved_location = $1
       WHERE location->>'city' = $2 OR 
             resolved_location = $2`,
      [resolvedLocation, locationKey]
    );
  } catch (error) {
    console.error(`Error updating resolved location for ${locationKey}: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};
