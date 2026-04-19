-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  tagline text NOT NULL,
  bio text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  linkedin text NOT NULL
);

CREATE TABLE IF NOT EXISTS stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  target integer,
  suffix text,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  period text NOT NULL,
  description text[] NOT NULL DEFAULT '{}',
  is_current boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  is_dark boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  tech_stack text[] NOT NULL DEFAULT '{}',
  is_gated boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  project_url text
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin'))
);

CREATE TABLE IF NOT EXISTS access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  UNIQUE(user_id, project_id)
);

-- ============================================================
-- ADMIN HELPER
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;

-- profile: public read, admin write
CREATE POLICY "Public read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Admin write profile" ON profile FOR ALL USING (is_admin());

-- stats: public read, admin write
CREATE POLICY "Public read stats" ON stats FOR SELECT USING (true);
CREATE POLICY "Admin write stats" ON stats FOR ALL USING (is_admin());

-- experience: public read, admin write
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Admin write experience" ON experience FOR ALL USING (is_admin());

-- skills: public read, admin write
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Admin write skills" ON skills FOR ALL USING (is_admin());

-- projects: published projects public read, admin full access
CREATE POLICY "Public read published projects" ON projects
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admin full access projects" ON projects
  FOR ALL USING (is_admin());

-- user_roles: users read own row, no self-write (admin inserts via Supabase Studio)
CREATE POLICY "Read own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- access_requests: users manage own requests, admin sees all
CREATE POLICY "Users read own requests" ON access_requests
  FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users insert own request" ON access_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin update requests" ON access_requests
  FOR UPDATE USING (is_admin());
