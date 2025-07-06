-- Add status constraints and update existing events
-- This migration ensures proper status values for event management

-- First, update any NULL status values to 'active'
UPDATE events 
SET status = 'active' 
WHERE status IS NULL;

-- Add a check constraint to ensure only valid status values
ALTER TABLE events 
ADD CONSTRAINT events_status_check 
CHECK (status IN ('active', 'cancelled', 'deleted', 'draft'));

-- Add an index for better query performance on status
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- Add an index for combined status and date queries
CREATE INDEX IF NOT EXISTS idx_events_status_date ON events(status, date_time);
