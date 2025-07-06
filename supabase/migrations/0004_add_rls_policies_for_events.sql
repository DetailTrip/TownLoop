-- Add Row Level Security policies for event management
-- This allows users to manage their own events properly

-- Enable RLS on events table (if not already enabled)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all active events (public read)
CREATE POLICY "Anyone can view active events" ON events
  FOR SELECT USING (status = 'active');

-- Policy: Users can view all their own events regardless of status
CREATE POLICY "Users can view their own events" ON events
  FOR SELECT USING (auth.uid() = creator_id);

-- Policy: Users can insert their own events
CREATE POLICY "Users can insert their own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Policy: Users can update their own events
CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Policy: Users can delete their own events (though we use soft delete)
CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (auth.uid() = creator_id);
