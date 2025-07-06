-- Fix function security issues identified by Supabase Advisor
-- Set secure search_path for functions to prevent security vulnerabilities

-- Drop and recreate update_user_xp function with security fixes
DROP FUNCTION IF EXISTS public.update_user_xp(uuid, integer);
CREATE OR REPLACE FUNCTION public.update_user_xp(user_id_param uuid, xp_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update user XP (implementation depends on your user schema)
  -- This is a placeholder - adjust based on your actual user table structure
  UPDATE auth.users 
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'),
    '{xp}',
    to_jsonb(COALESCE((raw_user_meta_data->>'xp')::integer, 0) + xp_amount)
  )
  WHERE id = user_id_param;
END;
$$;

-- Drop and recreate get_trending_events function with security fixes
DROP FUNCTION IF EXISTS public.get_trending_events(text);
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
SET search_path = public
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
