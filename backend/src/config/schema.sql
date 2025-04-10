CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location JSONB NOT NULL,
    parameter VARCHAR(50) NOT NULL,
    threshold FLOAT NOT NULL,
    condition VARCHAR(2) NOT NULL CHECK (condition IN ('>', '<', '>=', '<=', '==')),
    description TEXT,
    is_triggered BOOLEAN DEFAULT FALSE,
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 