-- Fix profiles INSERT policy to allow profile creation

-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;

-- Create a more permissive INSERT policy for authenticated users
CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
