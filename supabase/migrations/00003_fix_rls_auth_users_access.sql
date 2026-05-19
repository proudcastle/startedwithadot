-- Fix RLS policies that query auth.users directly.
-- The authenticated role cannot SELECT from auth.users,
-- causing "permission denied for table users" on INSERT.
--
-- email_confirmed_at is NOT a standard Supabase JWT claim, so it
-- cannot be checked in RLS. Email verification is enforced at the
-- application layer (Server Actions check user.email_confirmed_at
-- before attempting the insert). RLS enforces identity only.

-- Fix proposals INSERT policy
DROP POLICY IF EXISTS "Verified users can insert own proposals" ON proposals;
CREATE POLICY "Authenticated users can insert own proposals"
  ON proposals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix votes INSERT policy
DROP POLICY IF EXISTS "Verified users can insert own votes" ON votes;
CREATE POLICY "Authenticated users can insert own votes"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
