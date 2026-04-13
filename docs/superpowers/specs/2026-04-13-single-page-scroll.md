# Single-Page Scroll Navigation — Design Spec
**Date:** 2026-04-13
**Subject:** Convert Hafizh Fauzan portfolio from multi-page React Router app to single-page scroll navigation

---

## Overview

Convert the portfolio from a multi-page React Router v7 app (6 separate routes) into a single scrollable page. All sections render vertically on `/`. Navbar links smooth-scroll to their target section. The active nav link is highlighted based on which section is currently in the viewport. The URL never changes.

---

## Decisions

| Question | Decision |
|---|---|
| URL on scroll | Stays at `/` — no hash updates |
| Scroll mechanism | `scrollIntoView({ behavior: 'smooth' })` via section IDs |
| Active nav state | `useActiveSection` hook (IntersectionObserver) |
| About content | Full About section replaces the Home preview — no duplication |
| React Router | Removed entirely from the app |

---

## Page Structure

All sections render in sequence inside `<main>`. The Navbar stays sticky at the top. The Footer stays at the bottom.

```
<Navbar />              ← sticky, scroll-aware active state
<main>
  Hero                  ← from Home.jsx (no id needed — not a nav target)
  Key Numbers           ← from Home.jsx (no id needed — not a nav target)
  <section id="about">
  <section id="experience">
  <section id="skills">
  <section id="projects">
  <section id="contact">
</main>
<Footer />
```

The Hero and Key Numbers are not nav targets and do not get IDs. The HF logo scrolls to the top of the page (`window.scrollTo({ top: 0, behavior: 'smooth' })`).

---

## Navbar

### Links

| Label | Scroll target |
|---|---|
| About | `#about` |
| Experience | `#experience` |
| Skills | `#skills` |
| Projects | `#projects` |
| Contact | `#contact` |

"Get in Touch" CTA scrolls to `#contact`.

All nav items are `<button>` elements styled as links. `NavLink` and `Link` from react-router-dom are removed.

### Active State

A new `useActiveSection(ids)` hook observes all section IDs and returns the ID of the section currently in view. The Navbar uses the returned `activeId` to apply bold/dark styling to the matching link — identical visual treatment to the current `isActive` NavLink state.

---

## `useActiveSection` Hook

**File:** `src/hooks/useActiveSection.js`

Uses `IntersectionObserver` with `rootMargin: '-64px 0px -50% 0px'` (accounts for 64px sticky navbar height; a section becomes "active" when its top edge crosses the middle of the viewport).

Observes all provided IDs on mount. Returns the `id` of the most recently intersected element. Disconnects on unmount.

```js
useActiveSection(['about', 'experience', 'skills', 'projects', 'contact'])
// returns e.g. 'experience' when that section is in view
```

---

## Home.jsx Changes

The About preview section (the third block in the current `Home.jsx`) is removed. `Home.jsx` renders only:
1. Hero section — unchanged except `<Link to="/experience">` → scroll button
2. Key Numbers section — unchanged

The `Read More →` link (which pointed to `/about`) is removed along with the preview.

---

## Scroll Utility

A small inline helper used throughout Navbar and any in-page CTAs:

```js
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
```

Defined once inside `Navbar.jsx`. No separate utility file needed.

---

## Files Changed

| File | Change |
|---|---|
| `src/App.jsx` | Remove BrowserRouter/Routes/Route; render flat section stack |
| `src/components/Navbar.jsx` | Replace NavLink/Link with scroll buttons; add `useActiveSection` |
| `src/hooks/useActiveSection.js` | **New** — IntersectionObserver active-section tracker |
| `src/pages/Home.jsx` | Remove About preview; change "View Experience" Link → scroll button |
| `src/pages/About.jsx` | Add `id="about"` to root `<section>` |
| `src/pages/Experience.jsx` | Add `id="experience"` to root `<section>` |
| `src/pages/Skills.jsx` | Add `id="skills"` to root `<section>` |
| `src/pages/Projects.jsx` | Add `id="projects"` to root `<section>` |
| `src/pages/Contact.jsx` | Add `id="contact"` to root `<section>` |
| `package.json` | Remove `react-router-dom` dependency |

---

## Out of Scope

- Mobile hamburger menu (existing gap, not introduced by this change)
- URL hash updates on scroll
- Animated section transitions beyond existing `useReveal` fade-in
- Any visual design changes — behavior change only
