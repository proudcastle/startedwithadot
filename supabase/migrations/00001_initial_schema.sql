-- supabase/migrations/00001_initial_schema.sql
-- Complete database schema for "It All Started With a Dot"
-- Decisions D-03 through D-13 from CONTEXT.md

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Proposal status enum
CREATE TYPE proposal_status AS ENUM ('open', 'accepted', 'implemented', 'rejected');

-- =====================
-- Tables
-- =====================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

-- Case-insensitive unique index for usernames
CREATE UNIQUE INDEX profiles_username_lower_idx ON profiles (LOWER(username));

-- Proposals table
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text VARCHAR(140) NOT NULL,
  status proposal_status DEFAULT 'open' NOT NULL,
  vote_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX proposals_user_id_idx ON proposals (user_id);
CREATE INDEX proposals_status_idx ON proposals (status);
CREATE INDEX proposals_created_at_idx ON proposals (created_at DESC);

-- Votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, proposal_id)
);

CREATE INDEX votes_user_id_idx ON votes (user_id);
CREATE INDEX votes_proposal_id_idx ON votes (proposal_id);

-- Versions table
CREATE TABLE versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX versions_created_at_idx ON versions (created_at DESC);

-- =====================
-- Row Level Security
-- =====================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE versions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Proposals policies
CREATE POLICY "Anyone can view proposals"
  ON proposals FOR SELECT USING (true);

CREATE POLICY "Verified users can insert own proposals"
  ON proposals FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email_confirmed_at IS NOT NULL
    )
  );

CREATE POLICY "Admin can update proposal status"
  ON proposals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Votes policies
CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT USING (true);

CREATE POLICY "Verified users can insert own votes"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email_confirmed_at IS NOT NULL
    )
  );

CREATE POLICY "Users can delete own votes"
  ON votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Versions policies
CREATE POLICY "Anyone can view versions"
  ON versions FOR SELECT USING (true);

CREATE POLICY "Admin can insert versions"
  ON versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================
-- Triggers
-- =====================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NOW()
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update vote_count on proposals when votes change
CREATE OR REPLACE FUNCTION public.update_vote_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.proposals
    SET vote_count = vote_count + 1
    WHERE id = NEW.proposal_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.proposals
    SET vote_count = vote_count - 1
    WHERE id = OLD.proposal_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_vote_change
  AFTER INSERT OR DELETE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_vote_count();
