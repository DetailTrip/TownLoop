-- Add missing monitoring functions that aren't in 0012
-- This migration adds only the functions that aren't already defined

-- Function to get recent activity logs compatible with frontend expectations
CREATE OR REPLACE FUNCTION get_recent_activity_logs(limit_count integer DEFAULT 50)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  action_type text,
  table_name text,
  record_id text,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz,
  user_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    al.id,
    al.user_id,
    al.action_type,
    'activity_logs'::text as table_name, -- Placeholder since activity_logs doesn't store table_name
    al.entity_id::text as record_id,
    al.details,
    al.ip_address::text,
    al.user_agent,
    al.created_at,
    au.email as user_email
  FROM activity_logs al
  LEFT JOIN auth.users au ON al.user_id = au.id
  ORDER BY al.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Function to create sample system metrics (for demonstration)
CREATE OR REPLACE FUNCTION create_sample_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  -- Insert sample metrics
  INSERT INTO system_metrics (metric_name, metric_value, metric_unit, details) VALUES
  ('cpu_usage', random() * 100, 'percentage', jsonb_build_object('cores', 4, 'load_avg', random() * 4)),
  ('memory_usage', random() * 100, 'percentage', jsonb_build_object('total_gb', 16, 'available_gb', random() * 16)),
  ('disk_usage', random() * 100, 'percentage', jsonb_build_object('total_gb', 500, 'available_gb', random() * 500)),
  ('response_time', random() * 1000, 'ms', jsonb_build_object('endpoint', '/api/events', 'method', 'GET')),
  ('active_connections', floor(random() * 150), 'count', jsonb_build_object('max_connections', 200)),
  ('throughput', floor(random() * 1000), 'requests/min', jsonb_build_object('peak_rpm', 1500));
END;
$$;

-- Create some sample alerts for demonstration
INSERT INTO admin_alerts (alert_type, title, message, entity_type) VALUES
('security', 'Multiple Failed Login Attempts', 'User attempted to login 5 times unsuccessfully', 'user'),
('performance', 'High Response Time Detected', 'API response time exceeded 2 seconds', 'system'),
('system', 'Daily Backup Completed', 'Database backup completed successfully', 'backup')
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_recent_activity_logs TO authenticated;
GRANT EXECUTE ON FUNCTION create_sample_metrics TO authenticated;
