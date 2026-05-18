-- supabase/migrations/00002_admin_delete_proposals.sql
-- Adds RLS DELETE policy on proposals table for admin deletion
-- Required by ADMN-03: Admin can delete proposals

CREATE POLICY "Admin can delete proposals"
  ON proposals FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
