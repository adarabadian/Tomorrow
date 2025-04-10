import { pool } from '../config/database';

export interface Alert {
  id: string;
  name: string;
  location: {
    city?: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
  };
  parameter: string;
  threshold: number;
  condition: '>' | '<' | '>=' | '<=' | '==';
  description?: string;
  isTriggered: boolean;
  lastChecked: Date;
  createdAt: Date;
  updatedAt: Date;
  userEmail: string;
}

export const createAlert = async (alert: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>): Promise<Alert> => {
  const { rows } = await pool.query(
    `INSERT INTO alerts (name, location, parameter, threshold, condition, description, is_triggered, last_checked)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      alert.name,
      alert.location,
      alert.parameter,
      alert.threshold,
      alert.condition,
      alert.description,
      alert.isTriggered,
      alert.lastChecked
    ]
  );
  return mapRowToAlert(rows[0]);
};

export const getAlerts = async (): Promise<Alert[]> => {
  const { rows } = await pool.query('SELECT * FROM alerts');
  return rows.map(mapRowToAlert);
};

export const getAlertById = async (id: string): Promise<Alert | null> => {
  const { rows } = await pool.query('SELECT * FROM alerts WHERE id = $1', [id]);
  return rows.length ? mapRowToAlert(rows[0]) : null;
};

export const updateAlert = async (id: string, alert: Partial<Alert>): Promise<Alert | null> => {
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
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $9
     RETURNING *`,
    [
      alert.name,
      alert.location,
      alert.parameter,
      alert.threshold,
      alert.condition,
      alert.description,
      alert.isTriggered,
      alert.lastChecked,
      id
    ]
  );
  return rows.length ? mapRowToAlert(rows[0]) : null;
};

export const deleteAlert = async (id: string): Promise<boolean> => {
  const result = await pool.query('DELETE FROM alerts WHERE id = $1', [id]);
  return result.rowCount ? result.rowCount > 0 : false;
};

// Helper function to map database row to Alert object
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