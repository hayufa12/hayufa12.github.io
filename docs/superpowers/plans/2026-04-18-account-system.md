# Account System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Supabase-backed auth, a full admin dashboard for managing all portfolio content, and a visitor access-request system for gated project tools.

**Architecture:** All portfolio content (profile, stats, experience, skills, projects) moves from hardcoded JSX into Supabase tables, fetched at runtime via custom hooks. Admin logs in at `/admin/login` and manages everything from a protected dashboard. Visitors register at `/login`, request access to gated projects, and are approved by the admin. Gated project routes enforce auth + approval checks via React Router guards.

**Tech Stack:** Vite + React 19, React Router v7, @supabase/supabase-js, Tailwind CSS v3, Vitest + @testing-library/react

---

## File Map

**New files:**
- `supabase/schema.sql` — full DB schema: tables, RLS, helper function
- `supabase/seed.sql` — initial content seeded from existing JSX
- `.env.example` — env var template
- `src/lib/supabase.js` — Supabase client singleton
- `src/context/AuthContext.jsx` — auth state + isAdmin + useAuth hook
- `src/components/ProtectedAdminRoute.jsx` — redirects non-admins to /admin/login
- `src/components/ProtectedProjectRoute.jsx` — checks visitor approval for gated projects
- `src/hooks/useProfile.js` — fetch profile row
- `src/hooks/useStats.js` — fetch stats rows
- `src/hooks/useExperience.js` — fetch experience rows
- `src/hooks/useSkills.js` — fetch skills rows grouped by category
- `src/hooks/useProjects.js` — fetch projects rows
- `src/pages/Login.jsx` — visitor login/register page
- `src/pages/admin/AdminLogin.jsx` — admin login page
- `src/pages/admin/AdminLayout.jsx` — sidebar shell + `<Outlet />`
- `src/pages/admin/ProfileAdmin.jsx` — edit profile + stats
- `src/pages/admin/ExperienceAdmin.jsx` — CRUD experience entries
- `src/pages/admin/SkillsAdmin.jsx` — CRUD skills
- `src/pages/admin/ProjectsAdmin.jsx` — CRUD projects, toggle gated/published
- `src/pages/admin/AccessRequestsAdmin.jsx` — approve/reject visitor requests
- `src/test/setup.js` — jest-dom import

**Modified files:**
- `package.json` — add supabase-js, react-router-dom, vitest, testing-library
- `vite.config.js` — add test block
- `src/main.jsx` — wrap with AuthProvider
- `src/App.jsx` — replace flat render with BrowserRouter + Routes
- `src/pages/Home.jsx` — use useProfile + useStats hooks
- `src/pages/About.jsx` — use useProfile hook
- `src/pages/Experience.jsx` — use useExperience hook
- `src/pages/Skills.jsx` — use useSkills hook
- `src/pages/Projects.jsx` — use useProjects hook, lock icons, request access
- `src/pages/Contact.jsx` — use useProfile hook

---

## Task 1: Vitest setup

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`
- Create: `src/test/setup.js`

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Expected: packages added to `devDependencies` in `package.json`.

- [ ] **Step 2: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest"
```

- [ ] **Step 3: Configure Vite for Vitest**

Replace `vite.config.js` with:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
```

- [ ] **Step 4: Create test setup file**

Create `src/test/setup.js`:
```js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Verify Vitest runs**

```bash
npm test -- --run
```

Expected: "No test files found" (0 tests, exit 0). If it errors, check that `jsdom` is installed.

- [ ] **Step 6: Commit**

```bash
git add package.json vite.config.js src/test/setup.js
git commit -m "chore: add Vitest + Testing Library for unit tests"
```

---

## Task 2: Install runtime dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Supabase client and React Router**

```bash
npm install @supabase/supabase-js react-router-dom
```

Expected: both packages appear in `"dependencies"` in `package.json`.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add supabase-js and react-router-dom dependencies"
```

---

## Task 3: Supabase project setup (manual)

No code changes. Follow these steps in your browser.

- [ ] **Step 1: Create Supabase project**

Go to https://supabase.com/dashboard → New project. Name it `hafizh-portfolio`. Note your project URL and anon key from **Settings → API**.

- [ ] **Step 2: Enable email auth**

In Supabase Dashboard → **Authentication → Providers** → Email: ensure it is enabled. Disable "Confirm email" for now (you can re-enable later).

- [ ] **Step 3: Create admin account**

In Supabase Dashboard → **Authentication → Users** → "Add user" → enter your email (`hayeef8@gmail.com`) and a strong password. Note the UUID shown in the users table — you will use it in Task 4 seed.

- [ ] **Step 4: Note your credentials**

You will need:
- `VITE_SUPABASE_URL` — e.g. `https://xxxx.supabase.co`
- `VITE_SUPABASE_ANON_KEY` — the `anon` public key

---

## Task 4: Database schema + RLS

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Step 1: Create schema.sql**

Create `supabase/schema.sql`:
```sql
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
```

- [ ] **Step 2: Run schema in Supabase Studio**

In Supabase Dashboard → **SQL Editor** → paste the full content of `supabase/schema.sql` → Run.

Expected: all tables created, no errors.

- [ ] **Step 3: Insert admin user_roles row**

In Supabase Dashboard → **SQL Editor**, run (replacing `YOUR-ADMIN-UUID` with your UUID from Task 3 Step 3):
```sql
INSERT INTO user_roles (user_id, role) VALUES ('YOUR-ADMIN-UUID', 'admin');
```

- [ ] **Step 4: Commit schema file**

```bash
git add supabase/schema.sql
git commit -m "feat: add Supabase schema with RLS policies"
```

---

## Task 5: Supabase client + env config

**Files:**
- Create: `.env.example`
- Create: `.env.local` (not committed)
- Create: `src/lib/supabase.js`

- [ ] **Step 1: Create .env.example**

Create `.env.example`:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

- [ ] **Step 2: Create .env.local with your real values**

Create `.env.local` (never commit this file):
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Verify `.gitignore` already includes `.env.local`. If not, add it.

- [ ] **Step 3: Create Supabase client**

Create `src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

- [ ] **Step 4: Verify client loads**

Run `npm run dev` and open the browser console. No errors about missing env vars.

- [ ] **Step 5: Commit**

```bash
git add .env.example src/lib/supabase.js
git commit -m "feat: add Supabase client and env config"
```

---

## Task 6: Auth context + useAuth hook

**Files:**
- Create: `src/context/AuthContext.jsx`
- Create: `src/test/AuthContext.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/AuthContext.test.jsx`:
```jsx
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../context/AuthContext'

// Mock supabase module
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null }),
    }),
  },
}))

function TestConsumer() {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div>loading</div>
  return (
    <div>
      <span data-testid="user">{user ? 'logged-in' : 'guest'}</span>
      <span data-testid="admin">{isAdmin ? 'admin' : 'not-admin'}</span>
    </div>
  )
}

describe('AuthContext', () => {
  it('provides guest state when no session', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.queryByText('loading')).not.toBeInTheDocument())
    expect(screen.getByTestId('user').textContent).toBe('guest')
    expect(screen.getByTestId('admin').textContent).toBe('not-admin')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --run src/test/AuthContext.test.jsx
```

Expected: FAIL — `../context/AuthContext` not found.

- [ ] **Step 3: Implement AuthContext**

Create `src/context/AuthContext.jsx`:
```jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkAdmin(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          checkAdmin(session.user.id)
        } else {
          setIsAdmin(false)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function checkAdmin(userId) {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()
    setIsAdmin(data?.role === 'admin')
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- --run src/test/AuthContext.test.jsx
```

Expected: PASS (1 test).

- [ ] **Step 5: Wrap main.jsx with AuthProvider**

Replace `src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
```

- [ ] **Step 6: Commit**

```bash
git add src/context/AuthContext.jsx src/main.jsx src/test/AuthContext.test.jsx
git commit -m "feat: add AuthContext with admin role detection"
```

---

## Task 7: ProtectedAdminRoute component

**Files:**
- Create: `src/components/ProtectedAdminRoute.jsx`
- Create: `src/test/ProtectedAdminRoute.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/ProtectedAdminRoute.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ProtectedAdminRoute from '../components/ProtectedAdminRoute'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../context/AuthContext'

describe('ProtectedAdminRoute', () => {
  it('renders children when user is admin', () => {
    useAuth.mockReturnValue({ user: { id: '1' }, isAdmin: true, loading: false })
    render(
      <MemoryRouter>
        <ProtectedAdminRoute><div>admin content</div></ProtectedAdminRoute>
      </MemoryRouter>
    )
    expect(screen.getByText('admin content')).toBeInTheDocument()
  })

  it('redirects to /admin/login when not admin', () => {
    useAuth.mockReturnValue({ user: null, isAdmin: false, loading: false })
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ProtectedAdminRoute><div>admin content</div></ProtectedAdminRoute>
      </MemoryRouter>
    )
    expect(screen.queryByText('admin content')).not.toBeInTheDocument()
  })

  it('renders nothing while loading', () => {
    useAuth.mockReturnValue({ user: null, isAdmin: false, loading: true })
    const { container } = render(
      <MemoryRouter>
        <ProtectedAdminRoute><div>admin content</div></ProtectedAdminRoute>
      </MemoryRouter>
    )
    expect(container.firstChild).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --run src/test/ProtectedAdminRoute.test.jsx
```

Expected: FAIL — `../components/ProtectedAdminRoute` not found.

- [ ] **Step 3: Implement ProtectedAdminRoute**

Create `src/components/ProtectedAdminRoute.jsx`:
```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedAdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return null
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />
  return children
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- --run src/test/ProtectedAdminRoute.test.jsx
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ProtectedAdminRoute.jsx src/test/ProtectedAdminRoute.test.jsx
git commit -m "feat: add ProtectedAdminRoute guard"
```

---

## Task 8: ProtectedProjectRoute component

**Files:**
- Create: `src/components/ProtectedProjectRoute.jsx`
- Create: `src/test/ProtectedProjectRoute.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/ProtectedProjectRoute.test.jsx`:
```jsx
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProtectedProjectRoute from '../components/ProtectedProjectRoute'

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    }),
  },
}))

import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function wrap(element) {
  return (
    <MemoryRouter initialEntries={['/projects/abc']}>
      <Routes>
        <Route path="/projects/:id" element={element} />
        <Route path="/login" element={<div>login page</div>} />
        <Route path="/projects" element={<div>projects page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedProjectRoute', () => {
  it('redirects to /login when not authenticated', async () => {
    useAuth.mockReturnValue({ user: null, loading: false })
    render(wrap(<ProtectedProjectRoute><div>tool</div></ProtectedProjectRoute>))
    await waitFor(() => expect(screen.getByText('login page')).toBeInTheDocument())
  })

  it('renders children when access is approved', async () => {
    useAuth.mockReturnValue({ user: { id: 'u1' }, loading: false })
    supabase.from().select().eq().eq().single.mockResolvedValueOnce({
      data: { status: 'approved' },
    })
    render(wrap(<ProtectedProjectRoute><div>tool</div></ProtectedProjectRoute>))
    await waitFor(() => expect(screen.getByText('tool')).toBeInTheDocument())
  })

  it('redirects to /projects when access is pending', async () => {
    useAuth.mockReturnValue({ user: { id: 'u1' }, loading: false })
    supabase.from().select().eq().eq().single.mockResolvedValueOnce({
      data: { status: 'pending' },
    })
    render(wrap(<ProtectedProjectRoute><div>tool</div></ProtectedProjectRoute>))
    await waitFor(() => expect(screen.getByText('projects page')).toBeInTheDocument())
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --run src/test/ProtectedProjectRoute.test.jsx
```

Expected: FAIL — `../components/ProtectedProjectRoute` not found.

- [ ] **Step 3: Implement ProtectedProjectRoute**

Create `src/components/ProtectedProjectRoute.jsx`:
```jsx
import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function ProtectedProjectRoute({ children }) {
  const { id } = useParams()
  const { user, loading } = useAuth()
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    if (loading) return
    if (!user) { setStatus('unauthenticated'); return }

    supabase
      .from('access_requests')
      .select('status')
      .eq('user_id', user.id)
      .eq('project_id', id)
      .single()
      .then(({ data }) => {
        setStatus(data?.status ?? 'none')
      })
  }, [user, loading, id])

  if (loading || status === 'checking') return null
  if (status === 'unauthenticated') return <Navigate to="/login" replace state={{ projectId: id }} />
  if (status === 'approved') return children
  return <Navigate to="/projects" replace state={{ requestStatus: status, projectId: id }} />
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- --run src/test/ProtectedProjectRoute.test.jsx
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ProtectedProjectRoute.jsx src/test/ProtectedProjectRoute.test.jsx
git commit -m "feat: add ProtectedProjectRoute guard for gated project tools"
```

---

## Task 9: React Router integration

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Rewrite App.jsx with BrowserRouter + Routes**

Replace `src/App.jsx`:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Experience from './pages/Experience'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Login from './pages/Login'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'

function Portfolio() {
  return (
    <>
      <Navbar />
      <main>
        <Home />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Create stub pages so the app builds**

Create `src/pages/Login.jsx`:
```jsx
export default function Login() {
  return <div className="p-12 text-navy">Login — coming soon</div>
}
```

Create `src/pages/admin/AdminLogin.jsx`:
```jsx
export default function AdminLogin() {
  return <div className="p-12 text-navy">Admin Login — coming soon</div>
}
```

Create `src/pages/admin/AdminLayout.jsx`:
```jsx
export default function AdminLayout() {
  return <div className="p-12 text-navy">Admin Dashboard — coming soon</div>
}
```

- [ ] **Step 3: Verify the app still loads**

```bash
npm run dev
```

Open http://localhost:5173 — portfolio renders as before. Navigate to http://localhost:5173/admin/login — shows "Admin Login — coming soon".

- [ ] **Step 4: Run all tests**

```bash
npm test -- --run
```

Expected: all previously passing tests still pass.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/pages/Login.jsx src/pages/admin/AdminLogin.jsx src/pages/admin/AdminLayout.jsx
git commit -m "feat: add React Router with admin and login routes"
```

---

## Task 10: Content hooks

**Files:**
- Create: `src/hooks/useProfile.js`
- Create: `src/hooks/useStats.js`
- Create: `src/hooks/useExperience.js`
- Create: `src/hooks/useSkills.js`
- Create: `src/hooks/useProjects.js`

- [ ] **Step 1: Create useProfile hook**

Create `src/hooks/useProfile.js`:
```js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('profile')
      .select('*')
      .single()
      .then(({ data }) => {
        setProfile(data)
        setLoading(false)
      })
  }, [])

  return { profile, loading }
}
```

- [ ] **Step 2: Create useStats hook**

Create `src/hooks/useStats.js`:
```js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useStats() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('stats')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setStats(data ?? [])
        setLoading(false)
      })
  }, [])

  return { stats, loading }
}
```

- [ ] **Step 3: Create useExperience hook**

Create `src/hooks/useExperience.js`:
```js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useExperience() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('experience')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setJobs(data ?? [])
        setLoading(false)
      })
  }, [])

  return { jobs, loading }
}
```

- [ ] **Step 4: Create useSkills hook**

Create `src/hooks/useSkills.js`:
```js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useSkills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('skills')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setSkills(data ?? [])
        setLoading(false)
      })
  }, [])

  // Group by category, preserving order of first appearance
  const groups = skills.reduce((acc, skill) => {
    const existing = acc.find(g => g.category === skill.category)
    if (existing) {
      existing.skills.push(skill)
    } else {
      acc.push({ category: skill.category, skills: [skill] })
    }
    return acc
  }, [])

  return { groups, loading }
}
```

- [ ] **Step 5: Create useProjects hook**

Create `src/hooks/useProjects.js`:
```js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        setProjects(data ?? [])
        setLoading(false)
      })
  }, [])

  return { projects, loading }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useProfile.js src/hooks/useStats.js src/hooks/useExperience.js src/hooks/useSkills.js src/hooks/useProjects.js
git commit -m "feat: add content hooks for Supabase data fetching"
```

---

## Task 11: Seed initial content

**Files:**
- Create: `supabase/seed.sql`

- [ ] **Step 1: Create seed.sql**

Create `supabase/seed.sql`:
```sql
-- Profile
INSERT INTO profile (name, title, tagline, bio, email, phone, linkedin) VALUES (
  'Hafizh Fauzan',
  'Credit Risk Data Scientist',
  '4+ years building regulatory-grade scorecards and ML models on national-scale credit data. Specialized in risk strategy, feature engineering, and translating complex data insights for financial institutions.',
  'Credit Risk Data Scientist with 4+ years of experience across Banking, Multi-Finance, and Credit Bureau sectors. Specialized in building regulatory-grade Scorecards and ML models on massive datasets (100M+ subjects). Proven track record of leveraging national-scale credit data to drive risk strategy and revenue growth. Led cross-functional teams to boost leads. Proficient in Python, SQL, PySpark, and ML, focusing on actionable insights. Demonstrated leadership in data forums and bridging technical-business communication.',
  'hayeef8@gmail.com',
  '+62 812 2154 6465',
  'https://www.linkedin.com/in/hafizhf/'
);

-- Stats (target + suffix = animated counter; null target = static display)
INSERT INTO stats (label, value, target, suffix, sort_order) VALUES
  ('Years Experience',           '4+',    4,   '+',  0),
  ('Credit Subjects Analyzed',   '100M+', 100, 'M+', 1),
  ('Financial Institutions',     '30+',   30,  '+',  2),
  ('Approval Rate Lift',         '20–30%', NULL, NULL, 3);

-- Experience
INSERT INTO experience (company, role, period, description, is_current, sort_order) VALUES
(
  'CRIF Lembaga Informasi Keuangan',
  'Senior Analytics Consultant',
  'Jan 2024 - Present',
  ARRAY[
    'Developed and delivered multiple <strong>behavioral Scorecard models</strong> on the entire Indonesian credit data, combined with Telco data, on <strong>100+ million subjects</strong>.',
    'Built a <strong>high-dimensional feature store of 15,000+ derived attributes</strong> from raw SLIK data. Applied IV binning, missing value imputation, and feature clustering to reduce dimensionality to ~100 predictive features.',
    'Led the <strong>full model lifecycle PoC</strong> for 30+ major financial institutions - from segmentation analysis to model deployment. Established automated monitoring using PSI and GINI to detect model drift.',
    'Conducted <strong>Cut-Off analysis and Reject Inference</strong> to optimize risk strategy, achieving <strong>20–30% higher approval rates</strong> while maintaining flat NPL rates.',
    'Presented proof-of-concept solutions to key executives at <strong>50+ large financial institutions</strong>.',
    'Collaborated with the <strong>International CRIF team</strong> on Application, Behavioral, and Collection scorecards.',
    'Executed high-value <strong>market research projects</strong> (worth billions IDR) on Credit Card, BNPL, Personal Loan, and more.',
    'Served as <strong>acting Technical Lead</strong> for a squad of 3+ Analytics Consultants and Interns - conducting code reviews, overseeing delivery quality, and mentoring juniors.',
    'Created and maintained <strong>data-driven dashboards</strong> providing clients with real-time strategic insights.'
  ],
  true, 0
),
(
  'Astra Financial',
  'Data Scientist',
  'Nov 2022 - Jan 2024',
  ARRAY[
    'Led a major <strong>cross-sell and upsell project</strong>, driving a <strong>78% increase in valid leads</strong> and a <strong>35% rise in GMV</strong> across FIFGROUP, Astra Credit Companies, and Toyota Astra Financial Services.',
    'Led the <strong>Data Analytics Forum</strong> for Astra Financial and its subsidiaries, fostering collaboration and knowledge-sharing across data teams.',
    'Managed <strong>end-to-end ML model development</strong> for predictive analysis, improving targeting strategies and driving business growth.',
    'Collaborated with product and marketing teams to deliver <strong>actionable insights</strong> based on customer behavior.'
  ],
  false, 1
),
(
  'Bank Sinarmas',
  'Data Scientist → Data Science Graduate Camp (MT)',
  'Jun 2021 - Nov 2022',
  ARRAY[
    'Led development of a <strong>customer segmentation model</strong> using PySpark and Apache Spark, improving targeting capabilities.',
    'Delivered <strong>explainable AI solutions</strong>, enabling stakeholders to understand model outputs and make confident data-driven decisions.',
    'Presented comprehensive findings to <strong>senior leadership</strong>, translating complex data insights into actionable strategies.',
    'Led a key segmentation project resulting in improved marketing and product targeting strategies.'
  ],
  false, 2
);

-- Skills
INSERT INTO skills (name, category, is_dark, sort_order) VALUES
  ('Python',               'Programming',           true,  0),
  ('SQL',                  'Programming',           true,  1),
  ('PySpark',              'Programming',           true,  2),
  ('Predictive Modeling',  'ML & Analytics',        true,  3),
  ('Feature Engineering',  'ML & Analytics',        true,  4),
  ('Risk Analysis',        'ML & Analytics',        true,  5),
  ('Hadoop',               'Big Data',              false, 6),
  ('Apache Spark',         'Big Data',              false, 7),
  ('Tableau',              'Visualization & Tools', false, 8),
  ('Power BI',             'Visualization & Tools', false, 9),
  ('Git',                  'Visualization & Tools', false, 10),
  ('MS Excel',             'Visualization & Tools', false, 11);
```

- [ ] **Step 2: Run seed in Supabase Studio**

In Supabase Dashboard → **SQL Editor** → paste the full content of `supabase/seed.sql` → Run.

Expected: rows inserted into profile, stats, experience, skills. Verify in **Table Editor**.

- [ ] **Step 3: Commit seed file**

```bash
git add supabase/seed.sql
git commit -m "feat: add seed SQL with initial portfolio content"
```

---

## Task 12: Update portfolio pages to use Supabase data

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/About.jsx`
- Modify: `src/pages/Experience.jsx`
- Modify: `src/pages/Skills.jsx`
- Modify: `src/pages/Contact.jsx`

- [ ] **Step 1: Update Home.jsx**

Replace `src/pages/Home.jsx`:
```jsx
import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useCounter } from '../hooks/useCounter'
import { useProfile } from '../hooks/useProfile'
import { useStats } from '../hooks/useStats'
import photo from '../assets/photo.jpg'

function StatItem({ value, label, delay = '' }) {
  return (
    <div className={`reveal ${delay} px-7 py-9 border-r border-border last:border-r-0 hover:bg-bg-2 transition-colors duration-200`}>
      <div className="text-[40px] font-extrabold text-navy leading-none tracking-tight mb-2">{value}</div>
      <div className="text-xs font-medium text-text3 leading-snug">{label}</div>
    </div>
  )
}

function CounterStat({ target, suffix, label, delay = '' }) {
  const ref = useRef(null)
  useCounter(ref, target)
  return (
    <div className={`reveal ${delay} px-7 py-9 border-r border-border last:border-r-0 hover:bg-bg-2 transition-colors duration-200`}>
      <div className="text-[40px] font-extrabold text-navy leading-none tracking-tight mb-2">
        <span ref={ref}>0</span>{suffix}
      </div>
      <div className="text-xs font-medium text-text3 leading-snug">{label}</div>
    </div>
  )
}

const delays = ['', 'reveal-d1', 'reveal-d2', 'reveal-d3']

export default function Home() {
  const heroRef = useRef(null)
  const numbersRef = useRef(null)
  useReveal(heroRef, true)
  useReveal(numbersRef)

  const { profile } = useProfile()
  const { stats } = useStats()

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        aria-label="Introduction"
        className="bg-gradient-to-br from-bg-2 to-bg-3 px-12 pt-20 pb-[72px]"
      >
        <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-[60px] flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <div className="reveal inline-flex items-center gap-2 bg-white border border-border text-text2 text-xs font-medium px-[14px] py-[6px] rounded-full mb-6 shadow-sm">
              <span className="w-[7px] h-[7px] rounded-full bg-green flex-shrink-0 [animation:pulse_2.5s_ease-in-out_infinite] [box-shadow:0_0_0_2px_rgba(34,197,94,0.2)]" />
              Open to opportunities
            </div>
            <h1 className="reveal reveal-d1 text-[clamp(40px,5.5vw,64px)] font-extrabold text-navy leading-[1.05] tracking-[-1.5px] mb-[14px]">
              {profile?.name ?? 'Hafizh Fauzan'}
            </h1>
            <div className="reveal reveal-d2 text-base font-medium text-text2 mb-5">
              {profile?.title ?? 'Credit Risk Data Scientist'}
            </div>
            <p className="reveal reveal-d2 text-[14px] text-text3 leading-[1.8] max-w-[460px] mb-9">
              {profile?.tagline}
            </p>
            <div className="reveal reveal-d3 flex gap-3 flex-wrap">
              <a
                href="/Resume Hafizh Fauzan.pdf"
                download
                className="inline-flex items-center gap-2 bg-navy text-white text-[13px] font-semibold px-[22px] py-3 rounded-lg transition-all duration-200 hover:bg-navy-2 hover:-translate-y-px"
              >
                Download Resume
              </a>
              <button
                onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 bg-transparent text-navy border-2 border-navy text-[13px] font-semibold px-[22px] py-[10px] rounded-lg transition-all duration-200 hover:bg-navy/5 hover:-translate-y-px"
              >
                View Experience
              </button>
            </div>
          </div>
          <div className="reveal reveal-d2 flex-shrink-0 flex flex-col items-center gap-5">
            <div className="w-[220px] h-[220px] rounded-full border-4 border-navy overflow-hidden bg-bg-3 shadow-[0_8px_32px_rgba(26,26,46,0.15)]">
              <img
                src={photo}
                alt={profile?.name ?? 'Hafizh Fauzan'}
                className="w-full h-full object-cover object-top"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
              />
              <div className="hidden w-full h-full items-center justify-center text-[48px] font-extrabold text-navy">HF</div>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {['Python', 'PySpark', 'SQL', 'ML'].map(s => (
                <span key={s} className="bg-white border border-border text-navy text-xs font-semibold px-3 py-[5px] rounded-full shadow-sm">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div ref={numbersRef}>
        <section aria-label="Key statistics" className="border-t border-b border-border bg-white">
          <div className="max-w-[1100px] mx-auto grid grid-cols-4 max-[860px]:grid-cols-2">
            {stats.map((stat, i) =>
              stat.target != null ? (
                <CounterStat
                  key={stat.id}
                  target={stat.target}
                  suffix={stat.suffix}
                  label={stat.label}
                  delay={delays[i] ?? ''}
                />
              ) : (
                <StatItem key={stat.id} value={stat.value} label={stat.label} delay={delays[i] ?? ''} />
              )
            )}
          </div>
        </section>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Update About.jsx**

Replace `src/pages/About.jsx`:
```jsx
import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useProfile } from '../hooks/useProfile'

const sectors = ['Credit Bureau', 'Multi-Finance', 'Banking', 'BNPL / Personal Loan']

export default function About() {
  const ref = useRef(null)
  useReveal(ref)
  const { profile } = useProfile()

  return (
    <section id="about" ref={ref} aria-label="About" className="px-12 py-24 bg-white">
      <div className="max-w-[1100px] mx-auto grid grid-cols-[1fr_260px] gap-20 items-start max-[860px]:grid-cols-1 max-[860px]:gap-9">
        <div>
          <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">About</div>
          <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-[22px]">Professional Summary</h1>
          <p className="reveal reveal-d2 text-[14.5px] text-text2 leading-[1.85]">
            {profile?.bio}
          </p>
        </div>
        <div>
          <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">Sectors</div>
          <div className="flex flex-col gap-2 mt-[14px]">
            {sectors.map((s, i) => (
              <div key={s} className={`reveal reveal-d${i + 1} bg-bg-2 border-l-[3px] border-navy px-[14px] py-[10px] text-[13px] font-medium text-navy rounded-r-md transition-all duration-200 hover:bg-bg-3 hover:translate-x-[3px]`}>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Update Experience.jsx**

Replace the hardcoded `jobs` array and data usage in `src/pages/Experience.jsx`. Keep all existing JSX/styling intact — only change the data source:
```jsx
import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useExperience } from '../hooks/useExperience'

export default function Experience() {
  const ref = useRef(null)
  useReveal(ref)
  const { jobs } = useExperience()

  return (
    <section id="experience" ref={ref} aria-label="Experience" className="px-12 py-24 bg-bg-2 border-t border-b border-border">
      <div className="max-w-[1100px] mx-auto">
        <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">Experience</div>
        <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-14">Career Timeline</h1>
        <div className="flex flex-col">
          {jobs.map((job, idx) => (
            <div key={job.id} className={`reveal flex gap-8 ${idx < jobs.length - 1 ? 'pb-12' : ''}`}>
              <div className="flex flex-col items-center pt-1">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${job.is_current ? 'bg-green' : 'bg-navy/30'}`} />
                {idx < jobs.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="flex-1 pb-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-[6px]">
                  <span className="text-[15px] font-bold text-navy">{job.company}</span>
                  {job.is_current && (
                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-green bg-green/10 px-2 py-[2px] rounded">Current</span>
                  )}
                </div>
                <div className="text-[13px] font-semibold text-text2 mb-[4px]">{job.role}</div>
                <div className="text-[12px] text-text3 mb-4">{job.period}</div>
                <ul className="flex flex-col gap-[10px]">
                  {job.description.map((bullet, i) => (
                    <li key={i} className="flex gap-3 text-[13.5px] text-text2 leading-[1.7]">
                      <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-navy/25 flex-shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: bullet }} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Update Skills.jsx**

Replace `src/pages/Skills.jsx`:
```jsx
import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useSkills } from '../hooks/useSkills'

export default function Skills() {
  const ref = useRef(null)
  useReveal(ref)
  const { groups } = useSkills()

  return (
    <section id="skills" ref={ref} aria-label="Skills" className="px-12 py-24 bg-white">
      <div className="max-w-[1100px] mx-auto">
        <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">Skills</div>
        <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-10">Technical Toolkit</h1>
        <div className="grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
          {groups.map((g, i) => (
            <div
              key={g.category}
              className={`reveal reveal-d${i + 1} bg-bg-2 border border-border p-6 rounded-xl transition-all duration-200 hover:shadow-[0_4px_16px_rgba(26,26,46,0.08)] hover:border-border-2`}
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-text3 mb-[14px]">{g.category}</div>
              <div className="flex flex-wrap gap-2">
                {g.skills.map(s => (
                  <span
                    key={s.id}
                    className={`text-xs font-semibold px-[13px] py-[5px] rounded-md ${s.is_dark ? 'bg-navy text-white' : 'bg-bg-3 text-navy'}`}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Update Contact.jsx**

Replace `src/pages/Contact.jsx`:
```jsx
import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useProfile } from '../hooks/useProfile'

export default function Contact() {
  const ref = useRef(null)
  useReveal(ref)
  const { profile } = useProfile()

  const contacts = profile ? [
    { icon: '📧', type: 'Email',    value: profile.email,   href: `mailto:${profile.email}`,   delay: '' },
    { icon: '📞', type: 'Phone',    value: profile.phone,   href: `tel:${profile.phone.replace(/\s/g, '')}`, delay: 'reveal-d1' },
    { icon: '🔗', type: 'LinkedIn', value: profile.linkedin.replace('https://', ''), href: profile.linkedin, delay: 'reveal-d2' },
  ] : []

  return (
    <section id="contact" ref={ref} aria-label="Contact" className="px-12 py-24 bg-navy text-white text-center">
      <div className="max-w-[700px] mx-auto">
        <div className="reveal inline-block bg-white/[0.12] text-white/60 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-4">Contact</div>
        <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-white tracking-tight leading-snug mb-[14px]">Let's Work Together</h1>
        <p className="reveal reveal-d2 text-[14px] text-white/50 leading-[1.7] mb-11">
          Available for consulting engagements, full-time roles, and advisory work in credit risk &amp; data science.
        </p>
        <div className="flex flex-col gap-3 text-left">
          {contacts.map(c => (
            <a
              key={c.type}
              href={c.href}
              target={c.type === 'LinkedIn' ? '_blank' : undefined}
              rel={c.type === 'LinkedIn' ? 'noopener noreferrer' : undefined}
              className={`reveal ${c.delay} flex items-center gap-4 bg-white/[0.06] border border-white/10 px-5 py-4 rounded-[10px] transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:-translate-y-[2px]`}
            >
              <div className="text-[18px] w-10 text-center flex-shrink-0">{c.icon}</div>
              <div className="flex-1">
                <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40 mb-[2px]">{c.type}</div>
                <div className="text-[14px] font-medium text-white">{c.value}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Verify portfolio renders from Supabase**

```bash
npm run dev
```

Open http://localhost:5173. All sections should render with data from Supabase (same content as before, now fetched from DB).

- [ ] **Step 7: Commit**

```bash
git add src/pages/Home.jsx src/pages/About.jsx src/pages/Experience.jsx src/pages/Skills.jsx src/pages/Contact.jsx
git commit -m "feat: migrate portfolio pages to fetch content from Supabase"
```

---

## Task 13: Update Projects page (lock icons + access requests)

**Files:**
- Modify: `src/pages/Projects.jsx`

- [ ] **Step 1: Replace Projects.jsx**

Replace `src/pages/Projects.jsx`:
```jsx
import { useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useProjects } from '../hooks/useProjects'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

function LockIcon() {
  return (
    <svg className="w-4 h-4 text-text3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

function ProjectCard({ project, userRequest, onRequestAccess }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  function handleAction() {
    if (!project.is_gated) {
      navigate(`/projects/${project.id}`)
      return
    }
    if (!user) {
      navigate('/login', { state: { projectId: project.id } })
      return
    }
    if (userRequest?.status === 'approved') {
      navigate(`/projects/${project.id}`)
      return
    }
    if (!userRequest) {
      onRequestAccess(project.id)
    }
  }

  function getActionLabel() {
    if (!project.is_gated) return 'Open Project'
    if (!user) return 'Request Access'
    if (userRequest?.status === 'approved') return 'Open Project'
    if (userRequest?.status === 'pending') return 'Pending Approval'
    if (userRequest?.status === 'rejected') return 'Access Denied'
    return 'Request Access'
  }

  const isPending = userRequest?.status === 'pending'
  const isRejected = userRequest?.status === 'rejected'

  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-bold text-navy leading-snug">{project.title}</h3>
        {project.is_gated && <LockIcon />}
      </div>
      <p className="text-[13px] text-text3 leading-[1.7] flex-1">{project.description}</p>
      {project.tech_stack?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tech_stack.map(t => (
            <span key={t} className="text-[11px] font-semibold bg-bg-2 text-navy px-2 py-[3px] rounded">{t}</span>
          ))}
        </div>
      )}
      <button
        onClick={handleAction}
        disabled={isPending || isRejected}
        className={`mt-auto text-[13px] font-semibold px-4 py-2 rounded-lg transition-all duration-200
          ${isPending || isRejected
            ? 'bg-bg-2 text-text3 cursor-not-allowed'
            : 'bg-navy text-white hover:bg-navy-2 hover:-translate-y-px'
          }`}
      >
        {getActionLabel()}
      </button>
    </div>
  )
}

export default function Projects() {
  const ref = useRef(null)
  useReveal(ref)
  const { projects, loading } = useProjects()
  const { user } = useAuth()
  const [requests, setRequests] = useState({})

  async function handleRequestAccess(projectId) {
    if (!user) return
    const { data } = await supabase
      .from('access_requests')
      .insert({ user_id: user.id, project_id: projectId })
      .select()
      .single()
    if (data) {
      setRequests(prev => ({ ...prev, [projectId]: data }))
    }
  }

  return (
    <section id="projects" ref={ref} aria-label="Projects" className="px-12 py-24 bg-bg-2">
      <div className="max-w-[1100px] mx-auto">
        <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">Projects</div>
        <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-10">Work & Tools</h1>
        {loading ? null : projects.length === 0 ? (
          <div className="max-w-[500px] mx-auto text-center bg-white border border-border rounded-2xl p-12 shadow-sm">
            <p className="text-[14px] text-text3 leading-[1.7]">
              Projects will be showcased here soon. Check back later for case studies and work samples in credit risk and data science.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                userRequest={requests[project.id]}
                onRequestAccess={handleRequestAccess}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify the page renders**

```bash
npm run dev
```

Open http://localhost:5173 and scroll to Projects. Since the projects table is empty, the "coming soon" message shows. This is correct.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Projects.jsx
git commit -m "feat: update Projects page with Supabase data, lock icons, and access requests"
```

---

## Task 14: Visitor Login/Register page

**Files:**
- Modify: `src/pages/Login.jsx`

- [ ] **Step 1: Implement Login.jsx**

Replace `src/pages/Login.jsx`:
```jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const from = location.state?.projectId ? '/' : '/'

  if (user) {
    navigate(from, { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    }

    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-bg-2 flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] bg-white border border-border rounded-2xl p-10 shadow-sm">
        <div className="mb-8">
          <a href="/" className="text-[11px] font-bold tracking-[0.12em] uppercase text-text3 hover:text-navy transition-colors">
            ← Back to portfolio
          </a>
        </div>

        <h1 className="text-[22px] font-extrabold text-navy mb-1">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h1>
        <p className="text-[13px] text-text3 mb-8">
          {mode === 'login' ? 'Access gated project tools.' : 'Register to request access to project tools.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-text3 mb-[6px]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-[10px] text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-text3 mb-[6px]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-[10px] text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
            />
          </div>

          {error && (
            <p className="text-[13px] text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white text-[13px] font-semibold py-3 rounded-lg hover:bg-navy-2 transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-text3">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
            className="text-navy font-semibold hover:underline"
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify the page works**

```bash
npm run dev
```

Navigate to http://localhost:5173/login. The form renders. Try registering with a test email — it should succeed (check Supabase Dashboard → Authentication → Users).

- [ ] **Step 3: Commit**

```bash
git add src/pages/Login.jsx
git commit -m "feat: add visitor login/register page"
```

---

## Task 15: Admin Login page

**Files:**
- Modify: `src/pages/admin/AdminLogin.jsx`

- [ ] **Step 1: Implement AdminLogin.jsx**

Replace `src/pages/admin/AdminLogin.jsx`:
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }

    // Verify admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single()

    if (roleData?.role !== 'admin') {
      await supabase.auth.signOut()
      setError('This account does not have admin access.')
      setLoading(false)
      return
    }

    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-bg-2 flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] bg-white border border-border rounded-2xl p-10 shadow-sm">
        <div className="mb-8">
          <a href="/" className="text-[11px] font-bold tracking-[0.12em] uppercase text-text3 hover:text-navy transition-colors">
            ← Back to portfolio
          </a>
        </div>

        <h1 className="text-[22px] font-extrabold text-navy mb-1">Admin Login</h1>
        <p className="text-[13px] text-text3 mb-8">Sign in to manage your portfolio content.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-text3 mb-[6px]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-[10px] text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-text3 mb-[6px]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-[10px] text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
            />
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white text-[13px] font-semibold py-3 rounded-lg hover:bg-navy-2 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify admin login works end-to-end**

```bash
npm run dev
```

Navigate to http://localhost:5173/admin/login. Sign in with your admin credentials. You should be redirected to `/admin` (still the stub). Sign in with a non-admin account — you should see "This account does not have admin access."

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/AdminLogin.jsx
git commit -m "feat: add admin login page with role verification"
```

---

## Task 16: Admin Layout + sidebar

**Files:**
- Modify: `src/pages/admin/AdminLayout.jsx`

- [ ] **Step 1: Implement AdminLayout.jsx**

Replace `src/pages/admin/AdminLayout.jsx`:
```jsx
import { NavLink, Outlet, useNavigate, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ProfileAdmin from './ProfileAdmin'
import ExperienceAdmin from './ExperienceAdmin'
import SkillsAdmin from './SkillsAdmin'
import ProjectsAdmin from './ProjectsAdmin'
import AccessRequestsAdmin from './AccessRequestsAdmin'

const nav = [
  { label: 'Profile', path: 'profile' },
  { label: 'Experience', path: 'experience' },
  { label: 'Skills', path: 'skills' },
  { label: 'Projects', path: 'projects' },
  { label: 'Access Requests', path: 'access-requests' },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-bg-2">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-navy text-white flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/40 mb-1">Portfolio Admin</div>
          <div className="text-[15px] font-extrabold">Hafizh Fauzan</div>
        </div>
        <nav className="flex-1 py-4">
          {nav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-5 py-[10px] text-[13px] font-medium transition-colors duration-150 ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-5 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="text-[12px] font-medium text-white/50 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileAdmin />} />
          <Route path="experience" element={<ExperienceAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="access-requests" element={<AccessRequestsAdmin />} />
        </Routes>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Create stub admin section files so the app builds**

Create `src/pages/admin/ProfileAdmin.jsx`:
```jsx
export default function ProfileAdmin() {
  return <div className="p-8 text-navy font-bold">Profile — coming soon</div>
}
```

Create `src/pages/admin/ExperienceAdmin.jsx`:
```jsx
export default function ExperienceAdmin() {
  return <div className="p-8 text-navy font-bold">Experience — coming soon</div>
}
```

Create `src/pages/admin/SkillsAdmin.jsx`:
```jsx
export default function SkillsAdmin() {
  return <div className="p-8 text-navy font-bold">Skills — coming soon</div>
}
```

Create `src/pages/admin/ProjectsAdmin.jsx`:
```jsx
export default function ProjectsAdmin() {
  return <div className="p-8 text-navy font-bold">Projects — coming soon</div>
}
```

Create `src/pages/admin/AccessRequestsAdmin.jsx`:
```jsx
export default function AccessRequestsAdmin() {
  return <div className="p-8 text-navy font-bold">Access Requests — coming soon</div>
}
```

- [ ] **Step 3: Verify admin layout renders**

```bash
npm run dev
```

Sign in as admin and navigate to http://localhost:5173/admin. Sidebar renders with nav items. Each nav item shows the stub content.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AdminLayout.jsx src/pages/admin/ProfileAdmin.jsx src/pages/admin/ExperienceAdmin.jsx src/pages/admin/SkillsAdmin.jsx src/pages/admin/ProjectsAdmin.jsx src/pages/admin/AccessRequestsAdmin.jsx
git commit -m "feat: add admin layout with sidebar navigation"
```

---

## Task 17: Admin Profile section

**Files:**
- Modify: `src/pages/admin/ProfileAdmin.jsx`

- [ ] **Step 1: Implement ProfileAdmin.jsx**

Replace `src/pages/admin/ProfileAdmin.jsx`:
```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

function Field({ label, value, onChange, multiline = false }) {
  const cls = "w-full border border-border rounded-lg px-4 py-[10px] text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-text3 mb-[6px]">{label}</label>
      {multiline
        ? <textarea rows={4} value={value} onChange={e => onChange(e.target.value)} className={cls + ' resize-y'} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} className={cls} />
      }
    </div>
  )
}

function StatRow({ stat, onChange, onDelete }) {
  return (
    <div className="flex gap-3 items-center">
      <input
        type="text"
        value={stat.label}
        onChange={e => onChange({ ...stat, label: e.target.value })}
        placeholder="Label"
        className="flex-1 border border-border rounded-lg px-3 py-2 text-[13px] text-navy focus:outline-none focus:border-navy"
      />
      <input
        type="text"
        value={stat.value}
        onChange={e => onChange({ ...stat, value: e.target.value })}
        placeholder="Display value"
        className="w-28 border border-border rounded-lg px-3 py-2 text-[13px] text-navy focus:outline-none focus:border-navy"
      />
      <input
        type="number"
        value={stat.target ?? ''}
        onChange={e => onChange({ ...stat, target: e.target.value ? Number(e.target.value) : null })}
        placeholder="Target"
        className="w-20 border border-border rounded-lg px-3 py-2 text-[13px] text-navy focus:outline-none focus:border-navy"
      />
      <input
        type="text"
        value={stat.suffix ?? ''}
        onChange={e => onChange({ ...stat, suffix: e.target.value || null })}
        placeholder="Suffix"
        className="w-16 border border-border rounded-lg px-3 py-2 text-[13px] text-navy focus:outline-none focus:border-navy"
      />
      <button onClick={onDelete} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
    </div>
  )
}

export default function ProfileAdmin() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => setProfile(data))
    supabase.from('stats').select('*').order('sort_order').then(({ data }) => setStats(data ?? []))
  }, [])

  async function handleSave() {
    setSaving(true)
    await supabase.from('profile').update(profile).eq('id', profile.id)

    // Replace all stats: delete then re-insert in order
    await supabase.from('stats').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (stats.length > 0) {
      await supabase.from('stats').insert(
        stats.map((s, i) => ({ label: s.label, value: s.value, target: s.target, suffix: s.suffix, sort_order: i }))
      )
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function addStat() {
    setStats(prev => [...prev, { label: '', value: '', target: null, suffix: null, sort_order: prev.length }])
  }

  if (!profile) return <div className="p-8 text-text3">Loading…</div>

  return (
    <div className="p-8 max-w-[680px]">
      <h2 className="text-[18px] font-extrabold text-navy mb-6">Profile</h2>
      <div className="flex flex-col gap-5 mb-8">
        <Field label="Name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} />
        <Field label="Title" value={profile.title} onChange={v => setProfile(p => ({ ...p, title: v }))} />
        <Field label="Tagline" value={profile.tagline} onChange={v => setProfile(p => ({ ...p, tagline: v }))} multiline />
        <Field label="Bio" value={profile.bio} onChange={v => setProfile(p => ({ ...p, bio: v }))} multiline />
        <Field label="Email" value={profile.email} onChange={v => setProfile(p => ({ ...p, email: v }))} />
        <Field label="Phone" value={profile.phone} onChange={v => setProfile(p => ({ ...p, phone: v }))} />
        <Field label="LinkedIn URL" value={profile.linkedin} onChange={v => setProfile(p => ({ ...p, linkedin: v }))} />
      </div>

      <h2 className="text-[16px] font-extrabold text-navy mb-4">Stats</h2>
      <div className="text-[11px] text-text3 mb-3">Target + Suffix = animated counter. Leave Target blank for static display.</div>
      <div className="flex flex-col gap-3 mb-4">
        {stats.map((stat, i) => (
          <StatRow
            key={i}
            stat={stat}
            onChange={updated => setStats(prev => prev.map((s, j) => j === i ? updated : s))}
            onDelete={() => setStats(prev => prev.filter((_, j) => j !== i))}
          />
        ))}
      </div>
      <button onClick={addStat} className="text-[13px] text-navy font-semibold hover:underline mb-8">+ Add stat</button>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-navy text-white text-[13px] font-semibold px-6 py-3 rounded-lg hover:bg-navy-2 transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify Profile admin works**

```bash
npm run dev
```

Sign in as admin → navigate to http://localhost:5173/admin/profile. Edit the name and save. Refresh the portfolio homepage — the name should reflect the change.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/ProfileAdmin.jsx
git commit -m "feat: implement admin Profile section with stats management"
```

---

## Task 18: Admin Experience section

**Files:**
- Modify: `src/pages/admin/ExperienceAdmin.jsx`

- [ ] **Step 1: Implement ExperienceAdmin.jsx**

Replace `src/pages/admin/ExperienceAdmin.jsx`:
```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const empty = () => ({ company: '', role: '', period: '', description: [], is_current: false })

function JobForm({ job, onChange, onSave, onDelete, saving }) {
  function updateBullet(i, value) {
    const updated = [...job.description]
    updated[i] = value
    onChange({ ...job, description: updated })
  }

  function addBullet() {
    onChange({ ...job, description: [...job.description, ''] })
  }

  function removeBullet(i) {
    onChange({ ...job, description: job.description.filter((_, j) => j !== i) })
  }

  const cls = "w-full border border-border rounded-lg px-4 py-[10px] text-[13px] text-navy focus:outline-none focus:border-navy transition-colors"

  return (
    <div className="border border-border rounded-xl p-5 bg-white flex flex-col gap-4">
      <div className="flex gap-3">
        <input value={job.company} onChange={e => onChange({ ...job, company: e.target.value })}
          placeholder="Company" className={cls + ' flex-1'} />
        <label className="flex items-center gap-2 text-[12px] text-text3 whitespace-nowrap">
          <input type="checkbox" checked={job.is_current} onChange={e => onChange({ ...job, is_current: e.target.checked })} />
          Current
        </label>
      </div>
      <input value={job.role} onChange={e => onChange({ ...job, role: e.target.value })}
        placeholder="Role" className={cls} />
      <input value={job.period} onChange={e => onChange({ ...job, period: e.target.value })}
        placeholder="Period (e.g. Jan 2024 - Present)" className={cls} />

      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-text3">Bullets (HTML supported)</div>
        {job.description.map((b, i) => (
          <div key={i} className="flex gap-2">
            <textarea rows={2} value={b} onChange={e => updateBullet(i, e.target.value)}
              className={cls + ' flex-1 resize-none'} />
            <button onClick={() => removeBullet(i)} className="text-red-400 hover:text-red-600">×</button>
          </div>
        ))}
        <button onClick={addBullet} className="text-[12px] text-navy font-semibold hover:underline self-start">+ Add bullet</button>
      </div>

      <div className="flex gap-3">
        <button onClick={onSave} disabled={saving}
          className="bg-navy text-white text-[13px] font-semibold px-5 py-2 rounded-lg hover:bg-navy-2 transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
        {job.id && (
          <button onClick={onDelete}
            className="text-[13px] font-semibold text-red-400 hover:text-red-600 px-5 py-2 rounded-lg border border-red-200 hover:border-red-400 transition-colors">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default function ExperienceAdmin() {
  const [jobs, setJobs] = useState([])
  const [saving, setSaving] = useState(null)

  useEffect(() => {
    supabase.from('experience').select('*').order('sort_order').then(({ data }) => setJobs(data ?? []))
  }, [])

  function updateJob(i, updated) {
    setJobs(prev => prev.map((j, idx) => idx === i ? updated : j))
  }

  async function saveJob(i) {
    const job = jobs[i]
    setSaving(i)
    if (job.id) {
      await supabase.from('experience').update({
        company: job.company, role: job.role, period: job.period,
        description: job.description, is_current: job.is_current, sort_order: i,
      }).eq('id', job.id)
    } else {
      const { data } = await supabase.from('experience').insert({
        company: job.company, role: job.role, period: job.period,
        description: job.description, is_current: job.is_current, sort_order: i,
      }).select().single()
      if (data) updateJob(i, data)
    }
    setSaving(null)
  }

  async function deleteJob(i) {
    const job = jobs[i]
    if (job.id) await supabase.from('experience').delete().eq('id', job.id)
    setJobs(prev => prev.filter((_, idx) => idx !== i))
  }

  function addJob() {
    setJobs(prev => [...prev, empty()])
  }

  return (
    <div className="p-8 max-w-[720px]">
      <h2 className="text-[18px] font-extrabold text-navy mb-6">Experience</h2>
      <div className="flex flex-col gap-5 mb-5">
        {jobs.map((job, i) => (
          <JobForm key={job.id ?? i} job={job}
            onChange={updated => updateJob(i, updated)}
            onSave={() => saveJob(i)}
            onDelete={() => deleteJob(i)}
            saving={saving === i}
          />
        ))}
      </div>
      <button onClick={addJob} className="text-[13px] text-navy font-semibold hover:underline">+ Add experience</button>
    </div>
  )
}
```

- [ ] **Step 2: Verify Experience admin works**

Sign in as admin → http://localhost:5173/admin/experience. Edit a job and save. Refresh the portfolio — changes appear.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/ExperienceAdmin.jsx
git commit -m "feat: implement admin Experience section with CRUD"
```

---

## Task 19: Admin Skills section

**Files:**
- Modify: `src/pages/admin/SkillsAdmin.jsx`

- [ ] **Step 1: Implement SkillsAdmin.jsx**

Replace `src/pages/admin/SkillsAdmin.jsx`:
```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const empty = () => ({ name: '', category: '', is_dark: true })

function SkillRow({ skill, onChange, onSave, onDelete, saving }) {
  const cls = "border border-border rounded-lg px-3 py-2 text-[13px] text-navy focus:outline-none focus:border-navy transition-colors"
  return (
    <div className="flex gap-3 items-center">
      <input value={skill.name} onChange={e => onChange({ ...skill, name: e.target.value })}
        placeholder="Skill name" className={cls + ' flex-1'} />
      <input value={skill.category} onChange={e => onChange({ ...skill, category: e.target.value })}
        placeholder="Category" className={cls + ' w-40'} />
      <label className="flex items-center gap-1 text-[12px] text-text3 whitespace-nowrap">
        <input type="checkbox" checked={skill.is_dark}
          onChange={e => onChange({ ...skill, is_dark: e.target.checked })} />
        Dark
      </label>
      <button onClick={onSave} disabled={saving}
        className="text-[12px] font-semibold bg-navy text-white px-3 py-1 rounded-lg hover:bg-navy-2 disabled:opacity-50 transition-colors">
        {saving ? '…' : 'Save'}
      </button>
      <button onClick={onDelete} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
    </div>
  )
}

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([])
  const [saving, setSaving] = useState(null)

  useEffect(() => {
    supabase.from('skills').select('*').order('sort_order').then(({ data }) => setSkills(data ?? []))
  }, [])

  function updateSkill(i, updated) {
    setSkills(prev => prev.map((s, idx) => idx === i ? updated : s))
  }

  async function saveSkill(i) {
    const skill = skills[i]
    setSaving(i)
    if (skill.id) {
      await supabase.from('skills').update({
        name: skill.name, category: skill.category, is_dark: skill.is_dark, sort_order: i,
      }).eq('id', skill.id)
    } else {
      const { data } = await supabase.from('skills').insert({
        name: skill.name, category: skill.category, is_dark: skill.is_dark, sort_order: i,
      }).select().single()
      if (data) updateSkill(i, data)
    }
    setSaving(null)
  }

  async function deleteSkill(i) {
    const skill = skills[i]
    if (skill.id) await supabase.from('skills').delete().eq('id', skill.id)
    setSkills(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div className="p-8 max-w-[720px]">
      <h2 className="text-[18px] font-extrabold text-navy mb-2">Skills</h2>
      <p className="text-[12px] text-text3 mb-6">Skills with the same category name are grouped together on the portfolio.</p>
      <div className="flex flex-col gap-3 mb-5">
        {skills.map((skill, i) => (
          <SkillRow key={skill.id ?? i} skill={skill}
            onChange={updated => updateSkill(i, updated)}
            onSave={() => saveSkill(i)}
            onDelete={() => deleteSkill(i)}
            saving={saving === i}
          />
        ))}
      </div>
      <button onClick={() => setSkills(prev => [...prev, empty()])}
        className="text-[13px] text-navy font-semibold hover:underline">
        + Add skill
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify Skills admin works**

Sign in as admin → http://localhost:5173/admin/skills. Add a skill and save. Refresh the portfolio Skills section — new skill appears.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/SkillsAdmin.jsx
git commit -m "feat: implement admin Skills section with CRUD"
```

---

## Task 20: Admin Projects section

**Files:**
- Modify: `src/pages/admin/ProjectsAdmin.jsx`

- [ ] **Step 1: Implement ProjectsAdmin.jsx**

Replace `src/pages/admin/ProjectsAdmin.jsx`:
```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const empty = () => ({ title: '', description: '', tech_stack: [], is_gated: false, is_published: true, project_url: '' })

function ProjectForm({ project, onChange, onSave, onDelete, saving }) {
  const cls = "w-full border border-border rounded-lg px-4 py-[10px] text-[13px] text-navy focus:outline-none focus:border-navy transition-colors"

  function handleTechStack(value) {
    onChange({ ...project, tech_stack: value.split(',').map(t => t.trim()).filter(Boolean) })
  }

  return (
    <div className="border border-border rounded-xl p-5 bg-white flex flex-col gap-4">
      <input value={project.title} onChange={e => onChange({ ...project, title: e.target.value })}
        placeholder="Project title" className={cls} />
      <textarea rows={3} value={project.description} onChange={e => onChange({ ...project, description: e.target.value })}
        placeholder="Description" className={cls + ' resize-none'} />
      <input value={project.tech_stack.join(', ')} onChange={e => handleTechStack(e.target.value)}
        placeholder="Tech stack (comma-separated, e.g. Python, FastAPI)" className={cls} />
      <input value={project.project_url ?? ''} onChange={e => onChange({ ...project, project_url: e.target.value })}
        placeholder="Project URL (for non-gated projects)" className={cls} />
      <div className="flex gap-5">
        <label className="flex items-center gap-2 text-[13px] text-text2">
          <input type="checkbox" checked={project.is_gated}
            onChange={e => onChange({ ...project, is_gated: e.target.checked })} />
          Requires account access
        </label>
        <label className="flex items-center gap-2 text-[13px] text-text2">
          <input type="checkbox" checked={project.is_published}
            onChange={e => onChange({ ...project, is_published: e.target.checked })} />
          Published
        </label>
      </div>
      <div className="flex gap-3">
        <button onClick={onSave} disabled={saving}
          className="bg-navy text-white text-[13px] font-semibold px-5 py-2 rounded-lg hover:bg-navy-2 transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
        {project.id && (
          <button onClick={onDelete}
            className="text-[13px] font-semibold text-red-400 hover:text-red-600 px-5 py-2 rounded-lg border border-red-200 hover:border-red-400 transition-colors">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([])
  const [saving, setSaving] = useState(null)

  useEffect(() => {
    supabase.from('projects').select('*').order('sort_order').then(({ data }) => setProjects(data ?? []))
  }, [])

  function updateProject(i, updated) {
    setProjects(prev => prev.map((p, idx) => idx === i ? updated : p))
  }

  async function saveProject(i) {
    const proj = projects[i]
    setSaving(i)
    const payload = {
      title: proj.title, description: proj.description, tech_stack: proj.tech_stack,
      is_gated: proj.is_gated, is_published: proj.is_published,
      project_url: proj.project_url || null, sort_order: i,
    }
    if (proj.id) {
      await supabase.from('projects').update(payload).eq('id', proj.id)
    } else {
      const { data } = await supabase.from('projects').insert(payload).select().single()
      if (data) updateProject(i, data)
    }
    setSaving(null)
  }

  async function deleteProject(i) {
    const proj = projects[i]
    if (proj.id) await supabase.from('projects').delete().eq('id', proj.id)
    setProjects(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div className="p-8 max-w-[720px]">
      <h2 className="text-[18px] font-extrabold text-navy mb-6">Projects</h2>
      <div className="flex flex-col gap-5 mb-5">
        {projects.map((proj, i) => (
          <ProjectForm key={proj.id ?? i} project={proj}
            onChange={updated => updateProject(i, updated)}
            onSave={() => saveProject(i)}
            onDelete={() => deleteProject(i)}
            saving={saving === i}
          />
        ))}
      </div>
      <button onClick={() => setProjects(prev => [...prev, empty()])}
        className="text-[13px] text-navy font-semibold hover:underline">
        + Add project
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify Projects admin works**

Sign in as admin → http://localhost:5173/admin/projects. Add a project (mark it as gated and published). Refresh the portfolio Projects section — the project appears with a lock icon.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/ProjectsAdmin.jsx
git commit -m "feat: implement admin Projects section with CRUD and gated toggle"
```

---

## Task 21: Admin Access Requests section

**Files:**
- Modify: `src/pages/admin/AccessRequestsAdmin.jsx`

- [ ] **Step 1: Implement AccessRequestsAdmin.jsx**

Replace `src/pages/admin/AccessRequestsAdmin.jsx`:
```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

export default function AccessRequestsAdmin() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    // Join with projects to get title; user email comes from auth.users via Supabase's auth schema
    const { data } = await supabase
      .from('access_requests')
      .select(`
        id, status, requested_at, reviewed_at,
        project_id,
        projects ( title )
      `)
      .order('requested_at', { ascending: false })

    // Fetch user emails separately using admin API (anon key can only see own user)
    // Since we can't query auth.users from the client, we store user_id and display it as-is.
    // To show emails, go to Supabase Dashboard → Authentication → Users and cross-reference.
    setRequests(data ?? [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    setUpdating(id)
    await supabase
      .from('access_requests')
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', id)
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status, reviewed_at: new Date().toISOString() } : r)
    )
    setUpdating(null)
  }

  if (loading) return <div className="p-8 text-text3">Loading…</div>

  const pending = requests.filter(r => r.status === 'pending')
  const others = requests.filter(r => r.status !== 'pending')

  return (
    <div className="p-8 max-w-[760px]">
      <h2 className="text-[18px] font-extrabold text-navy mb-6">Access Requests</h2>

      {requests.length === 0 && (
        <p className="text-[14px] text-text3">No access requests yet.</p>
      )}

      {pending.length > 0 && (
        <>
          <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-text3 mb-3">Pending ({pending.length})</h3>
          <div className="flex flex-col gap-3 mb-8">
            {pending.map(req => (
              <RequestRow key={req.id} req={req} onApprove={() => updateStatus(req.id, 'approved')}
                onReject={() => updateStatus(req.id, 'rejected')} updating={updating === req.id} />
            ))}
          </div>
        </>
      )}

      {others.length > 0 && (
        <>
          <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-text3 mb-3">Reviewed</h3>
          <div className="flex flex-col gap-3">
            {others.map(req => (
              <RequestRow key={req.id} req={req} updating={updating === req.id}
                onApprove={() => updateStatus(req.id, 'approved')}
                onReject={() => updateStatus(req.id, 'rejected')} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function RequestRow({ req, onApprove, onReject, updating }) {
  return (
    <div className="border border-border rounded-xl p-5 bg-white flex items-center gap-4">
      <div className="flex-1">
        <div className="text-[13px] font-bold text-navy mb-[2px]">{req.projects?.title ?? 'Unknown project'}</div>
        <div className="text-[11px] text-text3">User: {req.user_id}</div>
        <div className="text-[11px] text-text3">
          Requested: {new Date(req.requested_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
      <span className={`text-[11px] font-bold uppercase tracking-[0.08em] px-2 py-[3px] rounded ${STATUS_COLORS[req.status]}`}>
        {req.status}
      </span>
      <div className="flex gap-2">
        {req.status !== 'approved' && (
          <button onClick={onApprove} disabled={updating}
            className="text-[12px] font-semibold bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
            Approve
          </button>
        )}
        {req.status !== 'rejected' && (
          <button onClick={onReject} disabled={updating}
            className="text-[12px] font-semibold border border-red-300 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors">
            Reject
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify Access Requests admin works end-to-end**

1. Sign out of admin, register as a test visitor at http://localhost:5173/login
2. Add a gated project via admin, then as the test visitor click "Request Access" on the Projects page
3. Sign in as admin → http://localhost:5173/admin/access-requests — the pending request appears
4. Click "Approve" — status updates immediately
5. Sign back in as the visitor — clicking the project now opens `/projects/:id`

- [ ] **Step 3: Run all tests one final time**

```bash
npm test -- --run
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AccessRequestsAdmin.jsx
git commit -m "feat: implement admin Access Requests section with approve/reject"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered by |
|---|---|
| Admin manages all portfolio content | Tasks 17–20 |
| Visitor register + request access | Tasks 13–14 |
| Admin approves/rejects requests | Task 21 |
| Supabase Auth for both roles | Tasks 4, 6 |
| RLS: public read, admin write | Task 4 |
| Route protection for gated projects | Task 8, 13 |
| Admin login at /admin/login | Task 15 |
| Single admin account | Tasks 4, 15 |
| Content fetched from Supabase | Tasks 10, 12 |
| Lock icons on gated projects | Task 13 |

**Placeholder scan:** No TBDs. All code blocks are complete.

**Type consistency:**
- `useProfile()` returns `{ profile, loading }` — used consistently in Home, About, Contact
- `useExperience()` returns `{ jobs, loading }` — `job.description` is `text[]`, rendered with `dangerouslySetInnerHTML` ✓
- `useSkills()` returns `{ groups, loading }` — `group.category` and `group.skills[]` ✓
- `useProjects()` returns `{ projects, loading }` — `project.is_gated`, `project.id` ✓
- `access_requests` columns: `user_id`, `project_id`, `status`, `requested_at`, `reviewed_at` — consistent across Tasks 4, 8, 13, 21 ✓
- `user_roles` columns: `user_id`, `role` — consistent across Tasks 4, 6, 15 ✓
