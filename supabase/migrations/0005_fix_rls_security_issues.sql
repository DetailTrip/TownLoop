-- Fix RLS security issues identified by Supabase Advisor
-- Enable RLS on towns and event_interactions tables

-- Enable RLS on towns table
ALTER TABLE towns ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read towns (they're public reference data)
CREATE POLICY "Anyone can view towns" ON towns
  FOR SELECT USING (true);

-- Enable RLS on event_interactions table  
ALTER TABLE event_interactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own interactions
CREATE POLICY "Users can view their own interactions" ON event_interactions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own interactions (favorites, etc.)
CREATE POLICY "Users can insert their own interactions" ON event_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own interactions
CREATE POLICY "Users can update their own interactions" ON event_interactions
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own interactions
CREATE POLICY "Users can delete their own interactions" ON event_interactions
  FOR DELETE USING (auth.uid() = user_id);
