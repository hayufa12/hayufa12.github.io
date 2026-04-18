# Account System — Design Spec
**Date:** 2026-04-18
**Subject:** Supabase-backed auth, admin dashboard, and visitor access control

---

## Overview

Add an account system to the portfolio landing page with two roles:

1. **Admin (Hafizh)** — logs into a `/admin` dashboard to manage all portfolio content and approve/reject visitor access requests
2. **Visitors** — register, request access to gated projects, and use approved project tools embedded in the site

All portfolio content (bio, stats, experience, skills, projects) moves from hardcoded JSX into Supabase tables. The React app fetches content at runtime; the admin edits it from the dashboard.

---

## Architecture

```
React App (Vite)
├── Public routes        → portfolio pages (Home, About, Experience, Skills, Projects, Contact)
├── /login               → visitor login/register + access request flow
├── /admin               → protected admin dashboard (admin only)
└── /projects/:id        → gated project tool (requires approved visitor account)

Supabase
├── Auth                 → handles admin + visitor sessions (email/password)
├── Database             → stores all portfolio content + access requests
└── Row Level Security   → enforces who can read/write what
```

**Content flow:** All portfolio sections are stored in Supabase tables and fetched on page load. Admin edits content from `/admin`; changes reflect immediately for all visitors.

**Auth flow:**
- Admin logs in at `/admin/login` — single admin account in Supabase Auth
- Visitors register at `/login`, then request access to specific gated projects
- Admin approves/rejects requests from the dashboard
- Approved visitors can access gated project routes

---

## Database Schema

### Content Tables (public read, admin write)

| Table | Key Columns |
|---|---|
| `profile` | `name`, `title`, `tagline`, `bio`, `email`, `phone`, `linkedin` |
| `stats` | `label`, `value`, `sort_order` |
| `experience` | `company`, `role`, `period`, `description`, `is_current`, `sort_order` |
| `skills` | `name`, `category`, `sort_order` |
| `projects` | `title`, `description`, `tech_stack`, `is_gated`, `is_published`, `sort_order`, `project_url` |

### Auth/Access Tables

| Table | Key Columns |
|---|---|
| `access_requests` | `user_id` (→ `auth.users`), `project_id` (→ `projects`), `status` (`pending`\|`approved`\|`rejected`), `requested_at`, `reviewed_at` |

### Row Level Security Rules

| Table | Public | Visitor | Admin |
|---|---|---|---|
| `profile`, `stats`, `experience`, `skills` | SELECT | SELECT | ALL |
| `projects` (published only) | SELECT | SELECT | ALL |
| `access_requests` | — | SELECT/INSERT own rows | ALL |

---

## Admin Dashboard (`/admin`)

Protected route — unauthenticated visits redirect to `/admin/login`. Sidebar navigation with the following sections:

| Section | Capabilities |
|---|---|
| **Profile** | Edit bio, tagline, contact info, stats |
| **Experience** | Add/edit/remove jobs, reorder via `sort_order` |
| **Skills** | Add/edit/remove skills, group by category |
| **Projects** | Add/edit/remove projects, toggle `is_gated` and `is_published`, set `project_url` |
| **Access Requests** | View pending requests (visitor email, project, requested_at), approve or reject with one click |

Approving a request sets `status = 'approved'` and `reviewed_at = now()`. Access is granted immediately — no email notification in v1.

---

## Visitor Auth Flow

### Registration & Access Request
1. Visitor registers at `/login` with email/password
2. Projects page shows gated projects with a lock icon
3. Clicking a gated project shows a "Request Access" button — submits an `access_requests` row with `status = 'pending'`
4. Visitor sees "Access requested — pending approval" message

### Login & Project Access
1. Returning visitor logs in at `/login`
2. If approved for a project, they navigate to `/projects/:id` and use the tool
3. If pending or rejected, they see the appropriate status message

### Route Protection
`/projects/:id` for gated projects enforces two checks:
1. Is the user authenticated?
2. Does an `access_requests` row exist for this user + project with `status = 'approved'`?

If either check fails, redirect to `/login` with context (which project they tried to access).

---

## Out of Scope (v1)

- Email notifications when access is approved/rejected (add later via Supabase Edge Functions)
- OAuth providers (Google, GitHub) — email/password only
- Visitor profile pages or account settings
- Admin role management (single hardcoded admin account)
