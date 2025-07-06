-- Real-time monitoring and activity tracking for admin dashboard

-- Create activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'event', 'user', 'comment', etc.
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system health metrics table
CREATE TABLE IF NOT EXISTS public.system_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS public.admin_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL, -- 'warning', 'error', 'info', 'critical'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (admin only)
CREATE POLICY "Admin can view all activity logs" ON public.activity_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can view all system metrics" ON public.system_metrics
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can manage alerts" ON public.admin_alerts
  FOR ALL USING (public.is_admin());

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_activity(
  p_user_id uuid,
  p_action text,
  p_entity_type text,
  p_entity_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details);
END;
$$;

-- Function to get recent activity for admin dashboard
CREATE OR REPLACE FUNCTION public.get_recent_activity(
  limit_count integer DEFAULT 50,
  offset_count integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  username text,
  user_email text,
  action text,
  entity_type text,
  entity_id uuid,
  details jsonb,
  created_at timestamp with time zone
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
    al.id,
    al.user_id,
    COALESCE(p.username, 'Unknown') as username,
    COALESCE(au.email, 'Unknown') as user_email,
    al.action,
    al.entity_type,
    al.entity_id,
    al.details,
    al.created_at
  FROM public.activity_logs al
  LEFT JOIN public.profiles p ON al.user_id = p.id
  LEFT JOIN auth.users au ON al.user_id = au.id
  ORDER BY al.created_at DESC
  LIMIT limit_count OFFSET offset_count;
END;
$$;

-- Function to get system health metrics
CREATE OR REPLACE FUNCTION public.get_system_health()
RETURNS TABLE(
  metric_name text,
  current_value numeric,
  metric_unit text,
  status text,
  last_updated timestamp with time zone
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
  WITH latest_metrics AS (
    SELECT DISTINCT ON (metric_name)
      metric_name,
      metric_value,
      metric_unit,
      created_at
    FROM public.system_metrics
    ORDER BY metric_name, created_at DESC
  )
  SELECT 
    lm.metric_name,
    lm.metric_value as current_value,
    lm.metric_unit,
    CASE 
      WHEN lm.metric_name = 'database_connections' AND lm.metric_value > 80 THEN 'warning'
      WHEN lm.metric_name = 'response_time_ms' AND lm.metric_value > 1000 THEN 'warning'
      WHEN lm.metric_name = 'error_rate' AND lm.metric_value > 5 THEN 'critical'
      ELSE 'healthy'
    END as status,
    lm.created_at as last_updated
  FROM latest_metrics lm
  
  UNION ALL
  
  -- Add real-time calculated metrics
  SELECT 
    'active_users_24h' as metric_name,
    (SELECT COUNT(*) FROM auth.users WHERE last_sign_in_at >= NOW() - INTERVAL '24 hours')::numeric as current_value,
    'users' as metric_unit,
    'healthy' as status,
    NOW() as last_updated
  
  UNION ALL
  
  SELECT 
    'events_created_today' as metric_name,
    (SELECT COUNT(*) FROM public.events WHERE created_at >= CURRENT_DATE)::numeric as current_value,
    'events' as metric_unit,
    'healthy' as status,
    NOW() as last_updated
  
  UNION ALL
  
  SELECT 
    'pending_approvals' as metric_name,
    (SELECT COUNT(*) FROM public.events WHERE status = 'pending')::numeric as current_value,
    'events' as metric_unit,
    CASE 
      WHEN (SELECT COUNT(*) FROM public.events WHERE status = 'pending') > 10 THEN 'warning'
      ELSE 'healthy'
    END as status,
    NOW() as last_updated;
END;
$$;

-- Function to get admin alerts
CREATE OR REPLACE FUNCTION public.get_admin_alerts(
  unread_only boolean DEFAULT false
)
RETURNS TABLE(
  id uuid,
  alert_type text,
  title text,
  message text,
  entity_type text,
  entity_id uuid,
  is_read boolean,
  created_at timestamp with time zone,
  expires_at timestamp with time zone
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
    aa.id,
    aa.alert_type,
    aa.title,
    aa.message,
    aa.entity_type,
    aa.entity_id,
    aa.is_read,
    aa.created_at,
    aa.expires_at
  FROM public.admin_alerts aa
  WHERE (NOT unread_only OR aa.is_read = false)
    AND (aa.expires_at IS NULL OR aa.expires_at > NOW())
  ORDER BY aa.created_at DESC;
END;
$$;

-- Function to mark alert as read
CREATE OR REPLACE FUNCTION public.mark_alert_read(alert_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  UPDATE public.admin_alerts 
  SET is_read = true 
  WHERE id = alert_id;
END;
$$;

-- Function to create system alert
CREATE OR REPLACE FUNCTION public.create_alert(
  p_alert_type text,
  p_title text,
  p_message text,
  p_entity_type text DEFAULT NULL,
  p_entity_id uuid DEFAULT NULL,
  p_expires_hours integer DEFAULT 24
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  alert_id uuid;
BEGIN
  INSERT INTO public.admin_alerts (
    alert_type, title, message, entity_type, entity_id, expires_at
  ) VALUES (
    p_alert_type, p_title, p_message, p_entity_type, p_entity_id,
    CASE WHEN p_expires_hours IS NOT NULL THEN NOW() + (p_expires_hours || ' hours')::interval ELSE NULL END
  ) RETURNING id INTO alert_id;
  
  RETURN alert_id;
END;
$$;

-- Trigger to automatically log certain activities
CREATE OR REPLACE FUNCTION public.auto_log_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Log event creation
  IF TG_TABLE_NAME = 'events' AND TG_OP = 'INSERT' THEN
    PERFORM public.log_activity(
      NEW.creator_id,
      'event_created',
      'event',
      NEW.id,
      jsonb_build_object('title', NEW.title, 'town', NEW.town)
    );
    
    -- Create alert for new pending event
    IF NEW.status = 'pending' THEN
      PERFORM public.create_alert(
        'info',
        'New Event Pending Approval',
        'Event "' || NEW.title || '" is waiting for approval',
        'event',
        NEW.id,
        48
      );
    END IF;
  END IF;
  
  -- Log user registration
  IF TG_TABLE_NAME = 'profiles' AND TG_OP = 'INSERT' THEN
    PERFORM public.log_activity(
      NEW.id,
      'user_registered',
      'user',
      NEW.id,
      jsonb_build_object('username', NEW.username, 'town', NEW.town)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS auto_log_events ON public.events;
CREATE TRIGGER auto_log_events
  AFTER INSERT OR UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.auto_log_activity();

DROP TRIGGER IF EXISTS auto_log_profiles ON public.profiles;
CREATE TRIGGER auto_log_profiles
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.auto_log_activity();

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.log_activity(uuid, text, text, uuid, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_activity(integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_system_health() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_alerts(boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_alert_read(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_alert(text, text, text, text, uuid, integer) TO authenticated;

-- Insert some sample system metrics
INSERT INTO public.system_metrics (metric_name, metric_value, metric_unit) VALUES
('database_connections', 25, 'connections'),
('response_time_ms', 150, 'milliseconds'),
('error_rate', 0.5, 'percent'),
('memory_usage', 68, 'percent'),
('disk_usage', 45, 'percent');

-- Insert some sample alerts
INSERT INTO public.admin_alerts (alert_type, title, message, expires_at) VALUES
('info', 'System Update Available', 'A new system update is available for installation', NOW() + INTERVAL '7 days'),
('warning', 'High Database Usage', 'Database connections are approaching the limit', NOW() + INTERVAL '1 day');
