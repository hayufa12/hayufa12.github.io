# Hafizh Fauzan — Portfolio Landing Page

## Project Overview

Portfolio landing page for Hafizh Fauzan, a Credit Risk Data Scientist. Currently migrating from plain HTML/CSS to Vite + React + Tailwind CSS with React Router v6.

## Stack

- **Current:** Plain HTML/CSS + vanilla JS (`index.html`)
- **Target:** Vite 5 + React 18 + React Router v6 + Tailwind CSS v3

## Worktrees

Project-local worktrees live in `.worktrees/` (gitignored).

## Key Files

- `index.html` — current single-file portfolio (source of truth for content)
- `docs/superpowers/specs/` — design specs
- `docs/superpowers/plans/` — implementation plans
- `src/assets/photo.jpg` — profile photo (after migration)
- `Resume Hafizh Fauzan.pdf` — downloadable resume (keep at root)
- `Pas Photo Formal.jpg` — profile photo source (keep at root until migration)

## Conventions

- No CSS-in-JS, no animation libraries
- Tailwind utility classes only for styling
- Custom hooks for animations (`useReveal`, `useCounter`)
- Pixel-for-pixel port of existing design — no visual changes during migration
- Frequent small commits per feature/component

## Commands

```bash
npm run dev      # Start Vite dev server at localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview production build
```
