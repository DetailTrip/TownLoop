-- Add admin roles and permissions system
-- Add role column to profiles table

-- Add role column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));
    END IF;
END $$;

-- Create an index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Create admin role policy for profiles table
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Create admin role policy for events table (admins can see all events including deleted)
DROP POLICY IF EXISTS "Admins can view all events" ON events;
CREATE POLICY "Admins can view all events" ON events
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Create admin role policy for events table (admins can update any event)
DROP POLICY IF EXISTS "Admins can update any event" ON events;
CREATE POLICY "Admins can update any event" ON events
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;

-- Create function to get admin statistics
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE(
  total_events bigint,
  total_users bigint,
  active_events bigint,
  pending_events bigint,
  recent_signups bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.events)::bigint as total_events,
    (SELECT COUNT(*) FROM public.profiles)::bigint as total_users,
    (SELECT COUNT(*) FROM public.events WHERE status = 'active')::bigint as active_events,
    (SELECT COUNT(*) FROM public.events WHERE status = 'draft')::bigint as pending_events,
    (SELECT COUNT(*) FROM public.profiles WHERE created_at >= NOW() - INTERVAL '7 days')::bigint as recent_signups;
END;
$$;

-- Create function to get events pending approval
CREATE OR REPLACE FUNCTION public.get_pending_events()
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  creator_name text,
  created_at timestamp with time zone,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.description,
    p.display_name as creator_name,
    e.created_at,
    e.status
  FROM public.events e
  JOIN public.profiles p ON e.creator_id = p.id
  WHERE e.status IN ('draft', 'deleted')
  ORDER BY e.created_at DESC
  LIMIT 20;
END;
$$;
