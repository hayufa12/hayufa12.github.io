# Single-Page Scroll Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the multi-page React Router app into a single scrollable page where all sections live on `/` and navbar links smooth-scroll to their targets.

**Architecture:** React Router is removed entirely. `App.jsx` renders all page components stacked vertically. A new `useActiveSection` hook uses `IntersectionObserver` to track which section is visible and returns its ID so the Navbar can highlight the active link. Navbar links become `<button>` elements with `scrollIntoView` click handlers.

**Tech Stack:** Vite 8, React 19, Tailwind CSS v3 (no React Router)

---

## File Map

| File | Change |
|---|---|
| `src/hooks/useActiveSection.js` | **New** — IntersectionObserver hook returning active section ID |
| `src/App.jsx` | Remove BrowserRouter/Routes/Route; render flat section stack |
| `src/components/Navbar.jsx` | Replace NavLink/Link with scroll buttons; use `useActiveSection` |
| `src/pages/Home.jsx` | Remove About preview block; change "View Experience" Link → button |
| `src/pages/About.jsx` | Add `id="about"` to root `<section>` |
| `src/pages/Experience.jsx` | Add `id="experience"` to root `<section>` |
| `src/pages/Skills.jsx` | Add `id="skills"` to root `<section>` |
| `src/pages/Projects.jsx` | Add `id="projects"` to root `<section>` |
| `src/pages/Contact.jsx` | Add `id="contact"` to root `<section>` |
| `package.json` + `package-lock.json` | Remove `react-router-dom` |

---

## Task 1: Create `useActiveSection` hook

**Files:**
- Create: `src/hooks/useActiveSection.js`

- [ ] **Step 1: Create `src/hooks/useActiveSection.js`**

```js
import { useEffect, useState } from 'react'

export function useActiveSection(ids) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      {
        rootMargin: '-64px 0px -50% 0px',
        threshold: 0,
      }
    )

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [ids])

  return activeId
}
```

`rootMargin: '-64px 0px -50% 0px'` means: ignore the top 64px (navbar height) and only count a section as active when its top edge is in the upper half of the remaining viewport. This ensures exactly one section is active at a time as the user scrolls.

`ids` must be a **stable reference** (module-level constant, not inline array) to prevent the effect from re-running on every render.

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useActiveSection.js
git commit -m "feat: add useActiveSection IntersectionObserver hook"
```

---

## Task 2: Add section IDs to page components

**Files:**
- Modify: `src/pages/About.jsx`
- Modify: `src/pages/Experience.jsx`
- Modify: `src/pages/Skills.jsx`
- Modify: `src/pages/Projects.jsx`
- Modify: `src/pages/Contact.jsx`

Each change is one line: add `id="<section>"` to the existing root `<section>` element.

- [ ] **Step 1: Update `src/pages/About.jsx` line 9**

Find:
```jsx
    <section ref={ref} aria-label="About" className="px-12 py-24 bg-white">
```
Replace with:
```jsx
    <section id="about" ref={ref} aria-label="About" className="px-12 py-24 bg-white">
```

- [ ] **Step 2: Update `src/pages/Experience.jsx` line 12**

Find:
```jsx
    <section ref={ref} aria-label="Experience" className="px-12 py-24 bg-bg-2 border-t border-b border-border">
```
Replace with:
```jsx
    <section id="experience" ref={ref} aria-label="Experience" className="px-12 py-24 bg-bg-2 border-t border-b border-border">
```

- [ ] **Step 3: Update `src/pages/Skills.jsx` line 11**

Find:
```jsx
    <section ref={ref} aria-label="Skills" className="px-12 py-24 bg-white">
```
Replace with:
```jsx
    <section id="skills" ref={ref} aria-label="Skills" className="px-12 py-24 bg-white">
```

- [ ] **Step 4: Update `src/pages/Projects.jsx` line 3**

Find:
```jsx
    <section aria-label="Projects" className="px-12 py-24 bg-bg-2 min-h-[60vh] flex items-center justify-center">
```
Replace with:
```jsx
    <section id="projects" aria-label="Projects" className="px-12 py-24 bg-bg-2 min-h-[60vh] flex items-center justify-center">
```

- [ ] **Step 5: Update `src/pages/Contact.jsx` line 12**

Find:
```jsx
    <section ref={ref} aria-label="Contact" className="px-12 py-24 bg-navy text-white text-center">
```
Replace with:
```jsx
    <section id="contact" ref={ref} aria-label="Contact" className="px-12 py-24 bg-navy text-white text-center">
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/About.jsx src/pages/Experience.jsx src/pages/Skills.jsx src/pages/Projects.jsx src/pages/Contact.jsx
git commit -m "feat: add section IDs for scroll targeting"
```

---

## Task 3: Update `Home.jsx` — remove About preview, fix View Experience

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Replace `src/pages/Home.jsx` with the following**

```jsx
import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useCounter } from '../hooks/useCounter'
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

export default function Home() {
  const heroRef = useRef(null)
  const numbersRef = useRef(null)
  useReveal(heroRef, true)
  useReveal(numbersRef)

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        aria-label="Introduction"
        className="bg-gradient-to-br from-bg-2 to-bg-3 px-12 pt-20 pb-[72px]"
      >
        <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-[60px] flex-wrap">
          {/* Left */}
          <div className="flex-1 min-w-[280px]">
            <div className="reveal inline-flex items-center gap-2 bg-white border border-border text-text2 text-xs font-medium px-[14px] py-[6px] rounded-full mb-6 shadow-sm">
              <span className="w-[7px] h-[7px] rounded-full bg-green flex-shrink-0 [animation:pulse_2.5s_ease-in-out_infinite] [box-shadow:0_0_0_2px_rgba(34,197,94,0.2)]" />
              Open to opportunities
            </div>
            <h1 className="reveal reveal-d1 text-[clamp(40px,5.5vw,64px)] font-extrabold text-navy leading-[1.05] tracking-[-1.5px] mb-[14px]">
              Hafizh Fauzan
            </h1>
            <div className="reveal reveal-d2 text-base font-medium text-text2 mb-5">
              Credit Risk Data Scientist
            </div>
            <p className="reveal reveal-d2 text-[14px] text-text3 leading-[1.8] max-w-[460px] mb-9">
              4+ years building regulatory-grade scorecards and ML models on national-scale credit data.
              Specialized in risk strategy, feature engineering, and translating complex data insights
              for financial institutions.
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

          {/* Right */}
          <div className="reveal reveal-d2 flex-shrink-0 flex flex-col items-center gap-5">
            <div className="w-[220px] h-[220px] rounded-full border-4 border-navy overflow-hidden bg-bg-3 shadow-[0_8px_32px_rgba(26,26,46,0.15)]">
              <img
                src={photo}
                alt="Hafizh Fauzan"
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

      {/* KEY NUMBERS */}
      <div ref={numbersRef}>
        <section aria-label="Key statistics" className="border-t border-b border-border bg-white">
          <div className="max-w-[1100px] mx-auto grid grid-cols-4 max-[860px]:grid-cols-2">
            <CounterStat target={4}   suffix="+" label="Years Experience" />
            <CounterStat target={100} suffix="M+" label="Credit Subjects Analyzed" delay="reveal-d1" />
            <CounterStat target={30}  suffix="+" label="Financial Institutions" delay="reveal-d2" />
            <StatItem value="20–30%" label="Approval Rate Lift" delay="reveal-d3" />
          </div>
        </section>
      </div>
    </>
  )
}
```

What changed from the original:
- Removed `import { Link } from 'react-router-dom'`
- `<Link to="/experience" ...>View Experience</Link>` → `<button onClick={...}>View Experience</button>`
- Removed the entire About preview `<section>` block (lines 109–137 in the original)
- Renamed `bodyRef` → `numbersRef` (now only wraps Key Numbers)

- [ ] **Step 2: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: remove About preview from Home, convert View Experience to scroll button"
```

---

## Task 4: Update `App.jsx` — remove router, render flat stack

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace `src/App.jsx` with the following**

```jsx
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Experience from './pages/Experience'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Contact from './pages/Contact'

export default function App() {
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
```

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite starts at `http://localhost:5173`. Navigating to the page should show all sections stacked. Navbar links will not yet scroll correctly (Navbar still uses react-router — that's fixed in Task 5).

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: remove React Router, render all sections as flat stack"
```

---

## Task 5: Update `Navbar.jsx` — scroll buttons + active state

**Files:**
- Modify: `src/components/Navbar.jsx`

- [ ] **Step 1: Replace `src/components/Navbar.jsx` with the following**

```jsx
import { useEffect, useState } from 'react'
import { useActiveSection } from '../hooks/useActiveSection'

const links = [
  { id: 'about',      label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills',     label: 'Skills' },
  { id: 'projects',   label: 'Projects' },
  { id: 'contact',    label: 'Contact' },
]

const SECTION_IDS = links.map(l => l.id)

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const activeId = useActiveSection(SECTION_IDS)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      className={`sticky top-0 z-50 flex items-center justify-between px-12 h-16 bg-white/90 backdrop-blur-md border-b border-border transition-shadow duration-300 ${scrolled ? 'shadow-[0_2px_16px_rgba(26,26,46,0.08)]' : ''}`}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="text-lg font-extrabold text-navy tracking-tight"
      >
        HF
      </button>

      <div className="hidden md:flex gap-8">
        {links.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`text-[13px] font-medium transition-colors duration-200 ${activeId === id ? 'text-navy' : 'text-text3 hover:text-navy'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={() => scrollTo('contact')}
        className="bg-navy text-white text-[13px] font-semibold px-5 py-[9px] rounded-lg transition-all duration-200 hover:bg-navy-2 hover:-translate-y-px"
      >
        Get in Touch
      </button>
    </nav>
  )
}
```

Key changes from original:
- Removed `NavLink`, `Link` imports from react-router-dom
- Added `useActiveSection` import
- `links` array now uses `id` instead of `to`
- `SECTION_IDS` defined as a stable module-level constant (prevents effect re-runs)
- `scrollTo(id)` helper defined at module level
- HF logo: `<button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>`
- Nav links: `<button onClick={() => scrollTo(id)}>` with `activeId === id` for active styling
- "Get in Touch": `<button onClick={() => scrollTo('contact')}>`

- [ ] **Step 2: Verify scroll navigation works**

```bash
npm run dev
```

Navigate to `http://localhost:5173`. Check:
- Clicking "Experience" in the navbar should smooth-scroll to the Experience section
- As you scroll down, the active nav link should update (About → Experience → Skills → Projects → Contact)
- Clicking "HF" logo scrolls back to top
- "Get in Touch" scrolls to Contact section
- "View Experience" button in Hero scrolls to Experience section

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: replace NavLink with scroll buttons, add active section tracking"
```

---

## Task 6: Remove `react-router-dom` dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Uninstall react-router-dom**

```bash
npm uninstall react-router-dom
```

Expected: `react-router-dom` removed from `package.json` dependencies. `package-lock.json` updated.

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: clean build, no errors. `dist/` created.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove react-router-dom dependency"
```

---

## Self-Review

**Spec coverage:**
- [x] URL stays at `/` — no hash changes → `scrollIntoView` used throughout, no anchor hrefs
- [x] Scroll mechanism via section IDs + `scrollIntoView` → Tasks 2, 3, 4, 5
- [x] Active nav state via `useActiveSection` → Tasks 1 and 5
- [x] About preview removed, full About section replaces it → Task 3
- [x] React Router removed → Tasks 4 and 6
- [x] HF logo scrolls to top → Task 5

**Placeholder scan:** None found.

**Type consistency:** `useActiveSection(ids: string[])` returns `string`. Used in Navbar as `useActiveSection(SECTION_IDS)` where `SECTION_IDS` is `string[]`. Consistent throughout.
