CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location JSONB NOT NULL,
  resolved_location VARCHAR(255),
  parameter VARCHAR(50) NOT NULL,
  threshold NUMERIC NOT NULL,
  condition VARCHAR(10) NOT NULL,
  description TEXT,
  user_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  is_triggered BOOLEAN DEFAULT FALSE,
  last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_value NUMERIC,
  last_fetch_success BOOLEAN DEFAULT TRUE,
  last_fetch_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_alerts_user_email ON alerts(user_email);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status); 