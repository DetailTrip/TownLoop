-- Complete admin functions setup for TownLoop
-- This migration ensures all admin dashboard functions exist

-- First ensure the role column exists in profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user',
ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false;

-- Drop ALL existing functions to avoid conflicts
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_admin(uuid);
DROP FUNCTION IF EXISTS public.get_admin_stats();
DROP FUNCTION IF EXISTS public.get_all_users(integer, integer);
DROP FUNCTION IF EXISTS public.update_user_role(uuid, text);
DROP FUNCTION IF EXISTS public.toggle_user_ban(uuid);
DROP FUNCTION IF EXISTS public.get_admin_analytics(integer);
DROP FUNCTION IF EXISTS public.get_pending_events();
DROP FUNCTION IF EXISTS public.bulk_update_events(uuid[], text);
DROP FUNCTION IF EXISTS public.get_platform_settings();

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user has admin role
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Function to get admin statistics
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
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.events)::bigint as total_events,
    (SELECT COUNT(*) FROM public.profiles)::bigint as total_users,
    (SELECT COUNT(*) FROM public.events WHERE status = 'active')::bigint as active_events,
    (SELECT COUNT(*) FROM public.events WHERE status = 'pending')::bigint as pending_events,
    (SELECT COUNT(*) FROM public.profiles WHERE created_at >= NOW() - INTERVAL '7 days')::bigint as recent_signups;
END;
$$;

-- Function to get all users with details
CREATE OR REPLACE FUNCTION public.get_all_users(
  limit_count integer DEFAULT 50,
  offset_count integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  email text,
  username text,
  display_name text,
  role text,
  town text,
  created_at timestamp with time zone,
  last_sign_in_at timestamp with time zone,
  event_count bigint,
  is_banned boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    COALESCE(au.email, '')::text,
    COALESCE(p.username, '')::text,
    COALESCE(p.display_name, '')::text,
    COALESCE(p.role, 'user')::text,
    COALESCE(p.town, '')::text,
    p.created_at,
    au.last_sign_in_at,
    COALESCE((SELECT COUNT(*) FROM public.events WHERE creator_id = p.id), 0)::bigint,
    COALESCE(p.is_banned, false)::boolean
  FROM public.profiles p
  LEFT JOIN auth.users au ON p.id = au.id
  ORDER BY p.created_at DESC
  LIMIT limit_count OFFSET offset_count;
END;
$$;

-- Function to update user role
CREATE OR REPLACE FUNCTION public.update_user_role(
  target_user_id uuid,
  new_role text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  IF new_role NOT IN ('user', 'admin', 'moderator') THEN
    RAISE EXCEPTION 'Invalid role. Must be user, admin, or moderator.';
  END IF;

  UPDATE public.profiles 
  SET role = new_role, updated_at = NOW()
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found.';
  END IF;
END;
$$;

-- Function to toggle user ban status
CREATE OR REPLACE FUNCTION public.toggle_user_ban(
  target_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_ban_status boolean;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  UPDATE public.profiles 
  SET is_banned = NOT COALESCE(is_banned, false), updated_at = NOW()
  WHERE id = target_user_id
  RETURNING is_banned INTO new_ban_status;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found.';
  END IF;
  
  RETURN new_ban_status;
END;
$$;

-- Function to get admin analytics
CREATE OR REPLACE FUNCTION public.get_admin_analytics(
  days_back integer DEFAULT 30
)
RETURNS TABLE(
  date date,
  new_users bigint,
  new_events bigint,
  active_users bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - (days_back || ' days')::interval,
      CURRENT_DATE,
      '1 day'::interval
    )::date AS date
  )
  SELECT 
    ds.date,
    COALESCE(p.new_users, 0)::bigint as new_users,
    COALESCE(e.new_events, 0)::bigint as new_events,
    COALESCE(au.active_users, 0)::bigint as active_users
  FROM date_series ds
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*) as new_users
    FROM public.profiles
    WHERE created_at >= CURRENT_DATE - (days_back || ' days')::interval
    GROUP BY DATE(created_at)
  ) p ON ds.date = p.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*) as new_events
    FROM public.events
    WHERE created_at >= CURRENT_DATE - (days_back || ' days')::interval
    GROUP BY DATE(created_at)
  ) e ON ds.date = e.date
  LEFT JOIN (
    SELECT DATE(last_sign_in_at) as date, COUNT(*) as active_users
    FROM auth.users
    WHERE last_sign_in_at >= CURRENT_DATE - (days_back || ' days')::interval
    GROUP BY DATE(last_sign_in_at)
  ) au ON ds.date = au.date
  ORDER BY ds.date;
END;
$$;

-- Function to get pending events
CREATE OR REPLACE FUNCTION public.get_pending_events()
RETURNS TABLE(
  id uuid,
  title text,
  creator_id uuid,
  creator_name text,
  status text,
  created_at timestamp with time zone,
  date_time timestamp with time zone,
  town text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.creator_id,
    COALESCE(p.display_name, p.username, 'Unknown') as creator_name,
    e.status,
    e.created_at,
    e.date_time,
    e.town
  FROM public.events e
  LEFT JOIN public.profiles p ON e.creator_id = p.id
  WHERE e.status = 'pending'
  ORDER BY e.created_at DESC;
END;
$$;

-- Function to bulk update events
CREATE OR REPLACE FUNCTION public.bulk_update_events(
  event_ids uuid[],
  new_status text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  updated_count integer;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  IF new_status NOT IN ('active', 'rejected', 'pending', 'archived') THEN
    RAISE EXCEPTION 'Invalid status. Must be active, rejected, pending, or archived.';
  END IF;

  UPDATE public.events 
  SET status = new_status, updated_at = NOW()
  WHERE id = ANY(event_ids);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- Function to get platform settings (placeholder)
CREATE OR REPLACE FUNCTION public.get_platform_settings()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Return basic platform settings
  RETURN jsonb_build_object(
    'total_events', (SELECT COUNT(*) FROM public.events),
    'total_users', (SELECT COUNT(*) FROM public.profiles),
    'database_size_mb', 0, -- Placeholder
    'last_backup', null -- Placeholder
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_users(integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_role(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_user_ban(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_analytics(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_pending_events() TO authenticated;
GRANT EXECUTE ON FUNCTION public.bulk_update_events(uuid[], text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_platform_settings() TO authenticated;
