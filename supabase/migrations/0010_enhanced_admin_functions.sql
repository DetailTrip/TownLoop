-- Enhanced admin functions for user management and analytics

-- Function to get all users with details for admin management
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
    au.email,
    p.username,
    p.display_name,
    COALESCE(p.role, 'user') as role,
    p.town,
    p.created_at,
    au.last_sign_in_at,
    (SELECT COUNT(*) FROM public.events WHERE creator_id = p.id)::bigint as event_count,
    COALESCE(p.is_banned, false) as is_banned
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  ORDER BY p.created_at DESC
  LIMIT limit_count OFFSET offset_count;
END;
$$;

-- Function to update user role
CREATE OR REPLACE FUNCTION public.update_user_role(
  target_user_id uuid,
  new_role text
)
RETURNS boolean
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
  SET role = new_role
  WHERE id = target_user_id;

  RETURN FOUND;
END;
$$;

-- Function to ban/unban user
CREATE OR REPLACE FUNCTION public.toggle_user_ban(
  target_user_id uuid,
  ban_status boolean
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Add is_banned column if it doesn't exist
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN is_banned boolean DEFAULT false;
  EXCEPTION
    WHEN duplicate_column THEN
      -- Column already exists, do nothing
  END;

  UPDATE public.profiles 
  SET is_banned = ban_status
  WHERE id = target_user_id;

  RETURN FOUND;
END;
$$;

-- Function to get analytics data
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
      CURRENT_DATE - INTERVAL '1 day' * days_back,
      CURRENT_DATE,
      INTERVAL '1 day'
    )::date as date
  )
  SELECT 
    ds.date,
    COALESCE(u.new_users, 0) as new_users,
    COALESCE(e.new_events, 0) as new_events,
    COALESCE(a.active_users, 0) as active_users
  FROM date_series ds
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*)::bigint as new_users
    FROM public.profiles
    WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
    GROUP BY DATE(created_at)
  ) u ON ds.date = u.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*)::bigint as new_events
    FROM public.events
    WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
    GROUP BY DATE(created_at)
  ) e ON ds.date = e.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(DISTINCT creator_id)::bigint as active_users
    FROM public.events
    WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
    GROUP BY DATE(created_at)
  ) a ON ds.date = a.date
  ORDER BY ds.date DESC;
END;
$$;

-- Function for bulk event operations
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

  IF new_status NOT IN ('active', 'deleted', 'draft', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status.';
  END IF;

  UPDATE public.events 
  SET status = new_status
  WHERE id = ANY(event_ids);

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- Function to get platform settings (for future use)
CREATE OR REPLACE FUNCTION public.get_platform_settings()
RETURNS TABLE(
  setting_key text,
  setting_value text,
  description text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- For now, return some default settings
  -- Later we can create a settings table
  RETURN QUERY
  SELECT 
    'featured_events_count'::text as setting_key,
    '5'::text as setting_value,
    'Number of featured events to show on homepage'::text as description
  UNION ALL
  SELECT 
    'auto_approve_events'::text,
    'false'::text,
    'Automatically approve new events without admin review'::text
  UNION ALL
  SELECT 
    'maintenance_mode'::text,
    'false'::text,
    'Enable maintenance mode'::text;
END;
$$;
