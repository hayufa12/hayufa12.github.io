# React Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the existing plain HTML/CSS portfolio into a Vite + React + Tailwind CSS app with React Router v6 page routing.

**Architecture:** Vite project at the repo root replaces the existing `index.html`. All content is split into page components (`Home`, `About`, `Experience`, `Skills`, `Projects`, `Contact`) with a shared `Navbar` and `Footer`. Two custom hooks handle animations: `useReveal` (Intersection Observer fade-in) and `useCounter` (count-up animation).

**Tech Stack:** Vite 5, React 18, React Router v6, Tailwind CSS v3, PostCSS

---

## File Map

| File | Role |
|---|---|
| `index.html` | Vite entry — replaces old file |
| `vite.config.js` | Vite config |
| `tailwind.config.js` | Tailwind theme with custom colors |
| `postcss.config.js` | PostCSS for Tailwind |
| `src/main.jsx` | React root, BrowserRouter |
| `src/App.jsx` | Route definitions, root layout |
| `src/index.css` | Global resets, Inter font, scrollbar, animations |
| `src/hooks/useReveal.js` | Intersection Observer reveal hook |
| `src/hooks/useCounter.js` | Count-up animation hook |
| `src/components/Navbar.jsx` | Sticky nav with NavLink active states |
| `src/components/Footer.jsx` | Dark footer bar |
| `src/pages/Home.jsx` | Hero + Key Numbers + About preview |
| `src/pages/About.jsx` | Full professional summary + sector tags |
| `src/pages/Experience.jsx` | 3-role vertical timeline |
| `src/pages/Skills.jsx` | 4-category skills grid |
| `src/pages/Projects.jsx` | "Coming Soon" placeholder |
| `src/pages/Contact.jsx` | Contact cards, dark background |
| `src/assets/photo.jpg` | Profile photo (moved from root) |

---

## Task 1: Initialize Vite + React project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`

- [ ] **Step 1: Back up the old index.html**

```bash
cp index.html index.html.bak
```

- [ ] **Step 2: Initialize the Vite project in-place**

```bash
npm create vite@latest . -- --template react
```

When prompted about existing files, choose to ignore/overwrite — we will restore content in later steps.

- [ ] **Step 3: Install dependencies**

```bash
npm install
npm install react-router-dom
```

- [ ] **Step 4: Verify dev server runs**

```bash
npm run dev
```

Expected: Vite dev server starts, browser shows default Vite+React page at `http://localhost:5173`.

- [ ] **Step 5: Move profile photo to assets**

```bash
cp "Pas Photo Formal.jpg" src/assets/photo.jpg
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src/
git commit -m "chore: initialize Vite + React project scaffold"
```

---

## Task 2: Install and configure Tailwind CSS

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/index.css`

- [ ] **Step 1: Install Tailwind**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 2: Configure `tailwind.config.js`**

Replace the generated file with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:      '#1a1a2e',
        'navy-2':  '#252540',
        'bg-2':    '#f8f9ff',
        'bg-3':    '#eef0f8',
        border:    '#e2e5f0',
        'border-2':'#c5cce0',
        text2:     '#4a5568',
        text3:     '#718096',
        green:     '#22c55e',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Replace `src/index.css` with global styles**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  background: #ffffff;
  color: #1a1a2e;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #f8f9ff; }
::-webkit-scrollbar-thumb { background: #c5cce0; border-radius: 4px; }

:focus-visible {
  outline: 2px solid #1a1a2e;
  outline-offset: 3px;
  border-radius: 3px;
}

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
.reveal.visible { opacity: 1; transform: none; }
.reveal-d1 { transition-delay: 0.08s; }
.reveal-d2 { transition-delay: 0.16s; }
.reveal-d3 { transition-delay: 0.24s; }
.reveal-d4 { transition-delay: 0.32s; }

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(34,197,94,0.2); }
  50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0.08); }
}
```

- [ ] **Step 4: Import `index.css` in `src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 5: Verify Tailwind works**

```bash
npm run dev
```

Expected: dev server starts without errors.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.js postcss.config.js src/index.css src/main.jsx
git commit -m "chore: add Tailwind CSS with custom color palette"
```

---

## Task 3: Custom hooks — useReveal and useCounter

**Files:**
- Create: `src/hooks/useReveal.js`
- Create: `src/hooks/useCounter.js`

- [ ] **Step 1: Create `src/hooks/useReveal.js`**

```js
import { useEffect } from 'react'

export function useReveal(containerRef, triggerImmediately = false) {
  useEffect(() => {
    const container = containerRef?.current ?? document
    const els = container.querySelectorAll('.reveal')

    if (triggerImmediately) {
      els.forEach(el => el.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [containerRef, triggerImmediately])
}
```

- [ ] **Step 2: Create `src/hooks/useCounter.js`**

```js
import { useEffect, useRef } from 'react'

export function useCounter(elRef, target, duration = 1000) {
  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = now => {
          const p = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          el.textContent = Math.floor(ease * target)
          if (p < 1) requestAnimationFrame(tick)
          else el.textContent = target
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [elRef, target, duration])
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/
git commit -m "feat: add useReveal and useCounter hooks"
```

---

## Task 4: Navbar and Footer components

**Files:**
- Create: `src/components/Navbar.jsx`
- Create: `src/components/Footer.jsx`

- [ ] **Step 1: Create `src/components/Navbar.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/about',      label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/skills',     label: 'Skills' },
  { to: '/projects',   label: 'Projects' },
  { to: '/contact',    label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

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
      <Link to="/" className="text-lg font-extrabold text-navy tracking-tight">HF</Link>

      <div className="hidden md:flex gap-8">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `text-[13px] font-medium transition-colors duration-200 ${isActive ? 'text-navy' : 'text-text3 hover:text-navy'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      <Link
        to="/contact"
        className="bg-navy text-white text-[13px] font-semibold px-5 py-[9px] rounded-lg transition-all duration-200 hover:bg-navy-2 hover:-translate-y-px"
      >
        Get in Touch
      </Link>
    </nav>
  )
}
```

- [ ] **Step 2: Create `src/components/Footer.jsx`**

```jsx
export default function Footer() {
  return (
    <footer className="bg-[#13132a] border-t border-white/[0.06] px-12 py-5 flex items-center justify-between flex-wrap gap-2">
      <span className="text-xs text-white/30">© 2025 Hafizh Fauzan · Jakarta, Indonesia</span>
      <span className="text-xs text-white/30">Credit Risk Data Scientist</span>
    </footer>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/
git commit -m "feat: add Navbar and Footer components"
```

---

## Task 5: App.jsx — root layout and routes

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace `src/App.jsx`**

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

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/about"      element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/skills"     element={<Skills />} />
          <Route path="/projects"   element={<Projects />} />
          <Route path="/contact"    element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add root layout with React Router routes"
```

---

## Task 6: Home page (Hero + Key Numbers + About preview)

**Files:**
- Create: `src/pages/Home.jsx`

- [ ] **Step 1: Create `src/pages/Home.jsx`**

```jsx
import { useRef } from 'react'
import { Link } from 'react-router-dom'
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
  const bodyRef = useRef(null)
  useReveal(heroRef, true)
  useReveal(bodyRef)

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
              <Link
                to="/experience"
                className="inline-flex items-center gap-2 bg-transparent text-navy border-2 border-navy text-[13px] font-semibold px-[22px] py-[10px] rounded-lg transition-all duration-200 hover:bg-navy/5 hover:-translate-y-px"
              >
                View Experience
              </Link>
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

      <div ref={bodyRef}>
        {/* KEY NUMBERS */}
        <section aria-label="Key statistics" className="border-t border-b border-border bg-white">
          <div className="max-w-[1100px] mx-auto grid grid-cols-4 max-[860px]:grid-cols-2">
            <CounterStat target={4}   suffix="+" label="Years Experience" />
            <CounterStat target={100} suffix="M+" label="Credit Subjects Analyzed" delay="reveal-d1" />
            <CounterStat target={30}  suffix="+" label="Financial Institutions" delay="reveal-d2" />
            <StatItem value="20–30%" label="Approval Rate Lift" delay="reveal-d3" />
          </div>
        </section>

        {/* ABOUT PREVIEW */}
        <section aria-label="About" className="px-12 py-24 bg-white">
          <div className="max-w-[1100px] mx-auto grid grid-cols-[1fr_260px] gap-20 items-start max-[860px]:grid-cols-1 max-[860px]:gap-9">
            <div>
              <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">About</div>
              <h2 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-[22px]">Professional Summary</h2>
              <p className="reveal reveal-d2 text-[14.5px] text-text2 leading-[1.85]">
                Credit Risk Data Scientist with <strong className="text-navy font-semibold">4+ years of experience</strong> across Banking, Multi-Finance,
                and Credit Bureau sectors. Specialized in building <strong className="text-navy font-semibold">regulatory-grade Scorecards and ML models</strong> on massive datasets.
                Proven track record of leveraging national-scale credit data to drive <strong className="text-navy font-semibold">risk strategy and revenue growth</strong>.
              </p>
              <div className="reveal reveal-d3 mt-6">
                <Link to="/about" className="text-[13px] font-semibold text-navy border-b-2 border-navy pb-px hover:opacity-70 transition-opacity">
                  Read More →
                </Link>
              </div>
            </div>
            <div>
              <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">Sectors</div>
              <div className="flex flex-col gap-2 mt-[14px]">
                {['Credit Bureau', 'Multi-Finance', 'Banking', 'BNPL / Personal Loan'].map((s, i) => (
                  <div key={s} className={`reveal reveal-d${i + 1} bg-bg-2 border-l-[3px] border-navy px-[14px] py-[10px] text-[13px] font-medium text-navy rounded-r-md transition-all duration-200 hover:bg-bg-3 hover:translate-x-[3px]`}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify home page renders**

```bash
npm run dev
```

Navigate to `http://localhost:5173`. Expected: Hero section with photo, Key Numbers bar, About preview with "Read More" link.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx src/assets/
git commit -m "feat: add Home page with Hero, Key Numbers, and About preview"
```

---

## Task 7: About page

**Files:**
- Create: `src/pages/About.jsx`

- [ ] **Step 1: Create `src/pages/About.jsx`**

```jsx
import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

export default function About() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} aria-label="About" className="px-12 py-24 bg-white">
      <div className="max-w-[1100px] mx-auto grid grid-cols-[1fr_260px] gap-20 items-start max-[860px]:grid-cols-1 max-[860px]:gap-9">
        <div>
          <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">About</div>
          <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-[22px]">Professional Summary</h1>
          <p className="reveal reveal-d2 text-[14.5px] text-text2 leading-[1.85]">
            Credit Risk Data Scientist with <strong className="text-navy font-semibold">4+ years of experience</strong> across Banking, Multi-Finance,
            and Credit Bureau sectors. Specialized in building <strong className="text-navy font-semibold">regulatory-grade Scorecards and ML models</strong> on
            massive datasets (100M+ subjects). Proven track record of leveraging national-scale credit data to drive{' '}
            <strong className="text-navy font-semibold">risk strategy and revenue growth</strong>. Led cross-functional teams to boost leads.
            Proficient in <strong className="text-navy font-semibold">Python, SQL, PySpark, and ML</strong>, focusing on actionable insights.
            Demonstrated leadership in data forums and bridging technical-business communication.
          </p>
        </div>
        <div>
          <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">Sectors</div>
          <div className="flex flex-col gap-2 mt-[14px]">
            {['Credit Bureau', 'Multi-Finance', 'Banking', 'BNPL / Personal Loan'].map((s, i) => (
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

- [ ] **Step 2: Commit**

```bash
git add src/pages/About.jsx
git commit -m "feat: add About page"
```

---

## Task 8: Experience page

**Files:**
- Create: `src/pages/Experience.jsx`

- [ ] **Step 1: Create `src/pages/Experience.jsx`**

```jsx
import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

const jobs = [
  {
    company: 'CRIF Lembaga Informasi Keuangan',
    role: 'Senior Analytics Consultant',
    date: 'Jan 2024 - Present',
    current: true,
    bullets: [
      'Developed and delivered multiple <strong>behavioral Scorecard models</strong> on the entire Indonesian credit data, combined with Telco data, on <strong>100+ million subjects</strong>.',
      'Built a <strong>high-dimensional feature store of 15,000+ derived attributes</strong> from raw SLIK data. Applied IV binning, missing value imputation, and feature clustering to reduce dimensionality to ~100 predictive features.',
      'Led the <strong>full model lifecycle PoC</strong> for 30+ major financial institutions - from segmentation analysis to model deployment. Established automated monitoring using PSI and GINI to detect model drift.',
      'Conducted <strong>Cut-Off analysis and Reject Inference</strong> to optimize risk strategy, achieving <strong>20–30% higher approval rates</strong> while maintaining flat NPL rates.',
      'Presented proof-of-concept solutions to key executives at <strong>50+ large financial institutions</strong>.',
      'Collaborated with the <strong>International CRIF team</strong> on Application, Behavioral, and Collection scorecards.',
      'Executed high-value <strong>market research projects</strong> (worth billions IDR) on Credit Card, BNPL, Personal Loan, and more.',
      'Served as <strong>acting Technical Lead</strong> for a squad of 3+ Analytics Consultants and Interns - conducting code reviews, overseeing delivery quality, and mentoring juniors.',
      'Created and maintained <strong>data-driven dashboards</strong> providing clients with real-time strategic insights.',
    ],
  },
  {
    company: 'Astra Financial',
    role: 'Data Scientist',
    date: 'Nov 2022 - Jan 2024',
    current: false,
    bullets: [
      'Led a major <strong>cross-sell and upsell project</strong>, driving a <strong>78% increase in valid leads</strong> and a <strong>35% rise in GMV</strong> across FIFGROUP, Astra Credit Companies, and Toyota Astra Financial Services.',
      'Led the <strong>Data Analytics Forum</strong> for Astra Financial and its subsidiaries, fostering collaboration and knowledge-sharing across data teams.',
      'Managed <strong>end-to-end ML model development</strong> for predictive analysis, improving targeting strategies and driving business growth.',
      'Collaborated with product and marketing teams to deliver <strong>actionable insights</strong> based on customer behavior.',
    ],
  },
  {
    company: 'Bank Sinarmas',
    role: 'Data Scientist → Data Science Graduate Camp (MT)',
    date: 'Jun 2021 - Nov 2022',
    current: false,
    bullets: [
      'Led development of a <strong>customer segmentation model</strong> using PySpark and Apache Spark, improving targeting capabilities.',
      'Delivered <strong>explainable AI solutions</strong>, enabling stakeholders to understand model outputs and make confident data-driven decisions.',
      'Presented comprehensive findings to <strong>senior leadership</strong>, translating complex data insights into actionable strategies.',
      'Led a key segmentation project resulting in improved marketing and product targeting strategies.',
    ],
  },
]

export default function Experience() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} aria-label="Experience" className="px-12 py-24 bg-bg-2 border-t border-b border-border">
      <div className="max-w-[1100px] mx-auto">
        <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">Experience</div>
        <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-14">Career Timeline</h1>

        <div className="flex flex-col">
          {jobs.map((job, idx) => (
            <div key={job.company} className={`reveal flex gap-8 ${idx < jobs.length - 1 ? 'pb-12' : ''}`}>
              {/* Timeline column */}
              <div className="flex flex-col items-center w-5 flex-shrink-0">
                <div className={`w-[14px] h-[14px] rounded-full border-2 border-white flex-shrink-0 mt-[5px] ${job.current ? 'bg-green [box-shadow:0_0_0_3px_rgba(34,197,94,0.2)]' : 'bg-border-2 [box-shadow:0_0_0_2px_#c5cce0]'}`} />
                {idx < jobs.length - 1 && <div className="flex-1 w-[2px] bg-border mt-2" />}
              </div>
              {/* Content */}
              <div className="flex-1">
                <div className="text-[17px] font-bold text-navy mb-1">{job.company}</div>
                <div className="flex items-center gap-[10px] flex-wrap mb-4">
                  <span className="text-[13px] font-medium text-text2 italic">{job.role}</span>
                  <span className="text-[11px] font-semibold text-text3 bg-bg-3 px-[9px] py-[2px] rounded-[10px]">{job.date}</span>
                  {job.current && (
                    <span className="text-[10px] font-bold text-green bg-green/10 border border-green/20 px-2 py-[2px] rounded-[10px] tracking-wide">Current</span>
                  )}
                </div>
                <ul className="flex flex-col gap-[7px]">
                  {job.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="text-[13.5px] text-text2 leading-[1.65] pl-[18px] relative before:content-['→'] before:absolute before:left-0 before:text-navy before:text-[11px] before:font-bold before:top-[2px]"
                      dangerouslySetInnerHTML={{ __html: b }}
                    />
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

- [ ] **Step 2: Commit**

```bash
git add src/pages/Experience.jsx
git commit -m "feat: add Experience page with 3-role timeline"
```

---

## Task 9: Skills page

**Files:**
- Create: `src/pages/Skills.jsx`

- [ ] **Step 1: Create `src/pages/Skills.jsx`**

```jsx
import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

const groups = [
  {
    title: 'Programming',
    tags: [
      { label: 'Python', dark: true },
      { label: 'SQL', dark: true },
      { label: 'PySpark', dark: true },
    ],
  },
  {
    title: 'ML & Analytics',
    tags: [
      { label: 'Predictive Modeling', dark: true },
      { label: 'Feature Engineering', dark: true },
      { label: 'Risk Analysis', dark: true },
    ],
  },
  {
    title: 'Big Data',
    tags: [
      { label: 'Hadoop', dark: false },
      { label: 'Apache Spark', dark: false },
    ],
  },
  {
    title: 'Visualization & Tools',
    tags: [
      { label: 'Tableau', dark: false },
      { label: 'Power BI', dark: false },
      { label: 'Git', dark: false },
      { label: 'MS Excel', dark: false },
    ],
  },
]

export default function Skills() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} aria-label="Skills" className="px-12 py-24 bg-white">
      <div className="max-w-[1100px] mx-auto">
        <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">Skills</div>
        <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-10">Technical Toolkit</h1>
        <div className="grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
          {groups.map((g, i) => (
            <div
              key={g.title}
              className={`reveal reveal-d${i} bg-bg-2 border border-border p-6 rounded-xl transition-all duration-200 hover:shadow-[0_4px_16px_rgba(26,26,46,0.08)] hover:border-border-2`}
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-text3 mb-[14px]">{g.title}</div>
              <div className="flex flex-wrap gap-2">
                {g.tags.map(t => (
                  <span
                    key={t.label}
                    className={`text-xs font-semibold px-[13px] py-[5px] rounded-md ${t.dark ? 'bg-navy text-white' : 'bg-bg-3 text-navy'}`}
                  >
                    {t.label}
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

- [ ] **Step 2: Commit**

```bash
git add src/pages/Skills.jsx
git commit -m "feat: add Skills page"
```

---

## Task 10: Projects placeholder page

**Files:**
- Create: `src/pages/Projects.jsx`

- [ ] **Step 1: Create `src/pages/Projects.jsx`**

```jsx
export default function Projects() {
  return (
    <section aria-label="Projects" className="px-12 py-24 bg-bg-2 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-[500px] text-center bg-white border border-border rounded-2xl p-12 shadow-sm">
        <div className="inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-5">Projects</div>
        <h1 className="text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-4">Coming Soon</h1>
        <p className="text-[14px] text-text3 leading-[1.7]">
          Projects will be showcased here soon. Check back later for case studies and work samples in credit risk and data science.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Projects.jsx
git commit -m "feat: add Projects placeholder page"
```

---

## Task 11: Contact page

**Files:**
- Create: `src/pages/Contact.jsx`

- [ ] **Step 1: Create `src/pages/Contact.jsx`**

```jsx
import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

const contacts = [
  { icon: '📧', type: 'Email',    value: 'hayeef8@gmail.com',       href: 'mailto:hayeef8@gmail.com',               delay: '' },
  { icon: '📞', type: 'Phone',    value: '+62 812 2154 6465',        href: 'tel:+6281221546465',                     delay: 'reveal-d1' },
  { icon: '🔗', type: 'LinkedIn', value: 'linkedin.com/in/hafizhf', href: 'https://www.linkedin.com/in/hafizhf/',   delay: 'reveal-d2' },
]

export default function Contact() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} aria-label="Contact" className="px-12 py-24 bg-navy text-white text-center">
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

- [ ] **Step 2: Commit**

```bash
git add src/pages/Contact.jsx
git commit -m "feat: add Contact page"
```

---

## Task 12: Update Vite index.html and verify full app

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace `index.html` with Vite entry**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Hafizh Fauzan - Credit Risk Data Scientist with 4+ years experience in Scorecard modeling and ML on national-scale credit data." />
    <meta property="og:title" content="Hafizh Fauzan - Credit Risk Data Scientist" />
    <meta property="og:description" content="4+ years building regulatory-grade scorecards and ML models on 100M+ credit subjects." />
    <meta property="og:type" content="website" />
    <title>Hafizh Fauzan - Credit Risk Data Scientist</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Run dev server and verify all routes**

```bash
npm run dev
```

Check each route manually:
- `http://localhost:5173/` — Hero, Key Numbers, About preview
- `http://localhost:5173/about` — Full summary + sectors
- `http://localhost:5173/experience` — 3-role timeline
- `http://localhost:5173/skills` — Skills grid
- `http://localhost:5173/projects` — Coming soon card
- `http://localhost:5173/contact` — Contact cards on dark bg

- [ ] **Step 3: Run production build to confirm no errors**

```bash
npm run build
```

Expected: `dist/` folder created with no errors.

- [ ] **Step 4: Delete the backup file**

```bash
rm index.html.bak
```

- [ ] **Step 5: Commit**

```bash
git add index.html
git rm index.html.bak 2>/dev/null || true
git commit -m "feat: complete React migration — Vite + React Router + Tailwind"
```

---

## Self-Review

**Spec coverage check:**
- [x] Vite + React at root — Task 1
- [x] Tailwind with custom palette — Task 2
- [x] useReveal hook — Task 3
- [x] useCounter hook — Task 3
- [x] Navbar with NavLink active states — Task 4
- [x] Footer — Task 4
- [x] React Router routes — Task 5
- [x] Home (Hero + Key Numbers + About preview) — Task 6
- [x] About page — Task 7
- [x] Experience page — Task 8
- [x] Skills page — Task 9
- [x] Projects placeholder — Task 10
- [x] Contact page — Task 11
- [x] index.html Vite entry — Task 12

**Placeholder scan:** None found.

**Type consistency:** `useReveal(ref, triggerImmediately?)` and `useCounter(ref, target, duration?)` signatures are used consistently across all pages.
