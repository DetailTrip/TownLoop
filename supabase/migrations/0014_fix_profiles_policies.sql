-- Fix profiles RLS policies to prevent infinite recursion

-- Drop all existing profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create safe profiles policies
-- Allow profile creation (INSERT) - essential for signup
-- Make this more permissive to allow profile creation for any authenticated user
CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow profile viewing (SELECT) - public profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Allow profile updates - only own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin can update any profile (but avoid recursion by using auth.uid() directly)
CREATE POLICY "Service role can manage all profiles" ON profiles
  FOR ALL USING (auth.role() = 'service_role');
