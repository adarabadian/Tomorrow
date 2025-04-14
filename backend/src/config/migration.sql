-- Run this migration if you have existing data
-- This handles upgrading existing tables to the new schema

-- Check if the last_read column exists and rename it
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'alerts' AND column_name = 'last_read'
    ) THEN
        ALTER TABLE alerts RENAME COLUMN last_read TO last_value;
        ALTER TABLE alerts ALTER COLUMN last_value TYPE NUMERIC;
    ELSE
        -- If last_read doesn't exist, add last_value if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'alerts' AND column_name = 'last_value'
        ) THEN
            ALTER TABLE alerts ADD COLUMN last_value NUMERIC;
        END IF;
    END IF;
END $$;

-- Add last_fetch_success column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'alerts' AND column_name = 'last_fetch_success'
    ) THEN
        ALTER TABLE alerts ADD COLUMN last_fetch_success BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- Add last_fetch_time column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'alerts' AND column_name = 'last_fetch_time'
    ) THEN
        ALTER TABLE alerts ADD COLUMN last_fetch_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$; 