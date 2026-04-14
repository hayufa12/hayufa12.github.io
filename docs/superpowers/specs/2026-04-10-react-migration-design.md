# React Migration — Design Spec
**Date:** 2026-04-10  
**Subject:** Migrate Hafizh Fauzan portfolio from plain HTML/CSS to Vite + React + Tailwind CSS

---

## Overview

Migrate the existing single-file `index.html` portfolio into a proper Vite + React project at the repository root. The migration preserves all existing content and visual design while introducing React Router v6 for page-based navigation and Tailwind CSS for styling.

---

## Stack

| Tool | Purpose |
|---|---|
| Vite | Build tool and dev server |
| React 18 | UI component framework |
| React Router v6 | Client-side page routing |
| Tailwind CSS | Utility-first styling |

---

## Project Structure

```
/
├── index.html                    (Vite entry point — replaces old index.html)
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── src/
│   ├── main.jsx                  (React root, BrowserRouter setup)
│   ├── App.jsx                   (Route definitions, root layout)
│   ├── components/
│   │   ├── Navbar.jsx            (Shared nav with NavLink active states)
│   │   └── Footer.jsx            (Shared footer — minimal, dark bg)
│   ├── pages/
│   │   ├── Home.jsx              (Hero + Key Numbers + About preview)
│   │   ├── About.jsx             (Full professional summary + sector tags)
│   │   ├── Experience.jsx        (Full 3-role timeline)
│   │   ├── Skills.jsx            (4-category skills grid)
│   │   ├── Projects.jsx          (Placeholder — "Coming Soon" styled card)
│   │   └── Contact.jsx           (Contact cards, dark section style)
│   └── assets/
│       └── Pas Photo Formal.jpg  (Profile photo, moved from root)
├── Pas Photo Formal.jpg          (Original — to be moved to src/assets/)
└── Resume Hafizh Fauzan.pdf
```

---

## Routing

React Router v6 with a root layout component (`App.jsx`) that wraps all pages with `<Navbar>`. Routes:

| Route | Page | Content |
|---|---|---|
| `/` | `Home.jsx` | Hero, Key Numbers, About preview (2–3 sentences + "Read More" link to `/about`) |
| `/about` | `About.jsx` | Full professional summary + sector tags |
| `/experience` | `Experience.jsx` | Full vertical timeline (all 3 roles with green dot for current) |
| `/skills` | `Skills.jsx` | 4-category skills grid (Programming, ML & Analytics, Big Data, Visualization & Tools) |
| `/projects` | `Projects.jsx` | "Coming Soon" placeholder — styled card, no real content yet |
| `/contact` | `Contact.jsx` | Email, phone, LinkedIn contact cards with dark background |

**Navbar** uses `<NavLink>` for automatic active-state highlighting on the current route. Links: `About` · `Experience` · `Skills` · `Projects` · `Contact`. Right side: `Get in Touch` CTA (links to `/contact`). Left: `HF` monogram logo (links to `/`).

---

## Styling

All existing CSS variables translated into Tailwind config:

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      navy:     '#1a1a2e',
      'navy-2': '#252540',
      'bg-2':   '#f8f9ff',
      'bg-3':   '#eef0f8',
      border:   '#e2e5f0',
      text2:    '#4a5568',
      text3:    '#718096',
      green:    '#22c55e',
    },
    fontFamily: {
      sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
    },
  }
}
```

Google Fonts `Inter` loaded via `index.html` `<link>` tag (same as current).

No CSS-in-JS, no animation libraries. Plain Tailwind utility classes throughout.

---

## Animations

Re-implemented as lightweight custom React hooks (no external libraries):

- **`useReveal(ref)`** — Intersection Observer hook that adds a `visible` class for fade-in-up transitions. Applied to section wrappers on each page.
- **`useCounter(target, duration)`** — Counts up from 0 to target value on mount. Used in the Key Numbers section on `Home.jsx`.

---

## Content Mapping

All content from the existing `index.html` is preserved exactly:

| Section | Destination |
|---|---|
| Nav | `Navbar.jsx` (shared) |
| Hero | `Home.jsx` |
| Key Numbers (4 stats) | `Home.jsx` |
| About (preview) | `Home.jsx` — truncated with "Read More" to `/about` |
| About (full) | `About.jsx` |
| Experience timeline | `Experience.jsx` |
| Skills grid | `Skills.jsx` |
| Contact | `Contact.jsx` |
| Projects | `Projects.jsx` — placeholder only |

---

## Out of Scope

- 404 / Not Found page
- Framer Motion or other animation libraries
- SSR or SSG (Vite outputs a static client-side bundle)
- Projects page content (placeholder only — to be filled in a future session)
- Dark mode toggle
- Multi-language support
- Any visual design changes — pixel-for-pixel port of the existing design
