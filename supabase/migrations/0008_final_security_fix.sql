-- Final comprehensive security fix for all Supabase Advisor warnings
-- This addresses function security, RLS, and auth configuration

-- 1. Fix Function Security Issues
-- Drop and recreate functions with the most secure configuration
DROP FUNCTION IF EXISTS public.update_user_xp(uuid, integer);
DROP FUNCTION IF EXISTS public.get_trending_events(integer);

-- Create functions with explicit security settings
CREATE OR REPLACE FUNCTION public.update_user_xp(user_id_param uuid, xp_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
SET role = authenticator
AS $$
BEGIN
  -- Update user XP in user metadata
  UPDATE auth.users 
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'),
    '{xp}',
    to_jsonb(COALESCE((raw_user_meta_data->>'xp')::integer, 0) + xp_amount)
  )
  WHERE id = user_id_param;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_trending_events(limit_count integer DEFAULT 10)
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  date_time timestamp with time zone,
  location text,
  image_url text,
  tags text[],
  town text,
  view_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
SET role = authenticator
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.description,
    e.date_time,
    e.location,
    e.image_url,
    e.tags,
    e.town,
    e.view_count
  FROM events e
  WHERE e.status = 'active'
    AND e.date_time >= NOW()
  ORDER BY 
    e.view_count DESC NULLS LAST,
    e.created_at DESC
  LIMIT limit_count;
END;
$$;

-- 2. Ensure RLS is properly configured
ALTER TABLE towns ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_interactions ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they're correct
DROP POLICY IF EXISTS "Anyone can view towns" ON towns;
DROP POLICY IF EXISTS "Users can view their own interactions" ON event_interactions;
DROP POLICY IF EXISTS "Users can insert their own interactions" ON event_interactions;
DROP POLICY IF EXISTS "Users can update their own interactions" ON event_interactions;
DROP POLICY IF EXISTS "Users can delete their own interactions" ON event_interactions;

-- Create RLS policies
CREATE POLICY "Anyone can view towns" ON towns
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own interactions" ON event_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions" ON event_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions" ON event_interactions
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions" ON event_interactions
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Check if auth configuration can be set via SQL (these might need dashboard)
-- Note: Some auth settings require dashboard configuration
-- This is for documentation purposes

-- Auth settings that typically need dashboard configuration:
-- - Leaked password protection (Authentication → Attack Protection)
-- - Additional MFA options (Authentication → Multi-Factor)
-- - Captcha configuration (Authentication → Attack Protection)
