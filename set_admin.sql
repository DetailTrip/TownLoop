-- Find and set admin role for the user

-- First, let's see all users and their current roles
SELECT 
  p.id,
  au.email,
  p.username,
  p.role,
  p.created_at
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
ORDER BY p.created_at DESC;

-- Set the most recent user as admin (assuming that's you)
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM profiles 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Verify the update
SELECT 
  p.id,
  au.email,
  p.username,
  p.role
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE p.role = 'admin';
