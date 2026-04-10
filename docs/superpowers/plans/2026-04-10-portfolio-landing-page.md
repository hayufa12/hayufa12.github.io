# Hafizh Fauzan — Portfolio Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a polished, production-ready single-page portfolio for Hafizh Fauzan — a Credit Risk Data Scientist — that serves both recruiters and financial institution clients.

**Architecture:** Single self-contained `index.html` file with embedded CSS and vanilla JS. No build step, no framework, no external dependencies except Google Fonts (Inter). All content is hardcoded — no CMS or data layer.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox), vanilla JS (Intersection Observer, requestAnimationFrame), Google Fonts (Inter), assets in project root (`Pas Photo Formal.jpg`, `Resume Hafizh Fauzan.pdf`).

---

## File Map

| File | Role |
|---|---|
| `index.html` | The entire site — structure, styles, and scripts in one file |
| `Pas Photo Formal.jpg` | Profile photo (project root, referenced by relative path) |
| `Resume Hafizh Fauzan.pdf` | Downloadable resume (project root, referenced by relative path) |

No other files are created or modified.

---

## Design Reference

| Dimension | Value |
|---|---|
| Primary dark | `#1a1a2e` (navy) |
| Background | `#ffffff` |
| Subtle bg | `#f8f9ff` |
| Accent bg | `#eef0f8` |
| Body text | `#4a5568` |
| Muted text | `#718096` |
| Active green | `#22c55e` |
| Font | Inter (Google Fonts), fallback: `'Segoe UI', system-ui, sans-serif` |

---

## Task 1: Foundation & CSS Variables

**Files:**
- Modify: `index.html` (head section — meta, fonts, root variables, reset)

- [ ] **Step 1: Verify Google Fonts import is correct**

The `<head>` must include exactly this (no other font imports):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Verify meta tags are complete**

The `<head>` must contain all of these — add any missing:
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Hafizh Fauzan — Credit Risk Data Scientist with 4+ years experience in Scorecard modeling and ML on national-scale credit data.">
<meta property="og:title" content="Hafizh Fauzan — Credit Risk Data Scientist">
<meta property="og:description" content="4+ years building regulatory-grade scorecards and ML models on 100M+ credit subjects.">
<meta property="og:type" content="website">
<title>Hafizh Fauzan — Credit Risk Data Scientist</title>
```

- [ ] **Step 3: Verify CSS variables block is present and complete**

Inside `<style>`, the `:root` block must define exactly these variables:
```css
:root {
  --navy:    #1a1a2e;
  --navy-2:  #252540;
  --bg:      #ffffff;
  --bg-2:    #f8f9ff;
  --bg-3:    #eef0f8;
  --border:  #e2e5f0;
  --border-2: #c5cce0;
  --text:    #1a1a2e;
  --text-2:  #4a5568;
  --text-3:  #718096;
  --green:   #22c55e;
  --font:    'Inter', 'Segoe UI', system-ui, sans-serif;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

- [ ] **Step 4: Verify reset and body styles**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: 15px;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 5: Open `index.html` in browser and verify**

- Font loads as Inter (check DevTools → Network → Fonts)
- Background is white, body text is dark navy
- No horizontal scroll bar

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: foundation — meta tags, CSS variables, Inter font"
```

---

## Task 2: Navigation

**Files:**
- Modify: `index.html` (nav HTML + CSS + scroll shadow JS)

- [ ] **Step 1: Verify nav HTML structure**

The nav must be the first element inside `<body>`:
```html
<nav id="navbar">
  <div class="nav-logo">HF</div>
  <div class="nav-links">
    <a href="#about">About</a>
    <a href="#experience">Experience</a>
    <a href="#skills">Skills</a>
  </div>
  <a href="#contact" class="nav-cta">Get in Touch</a>
</nav>
```

- [ ] **Step 2: Verify nav CSS**

```css
nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  height: 64px;
  transition: box-shadow 0.3s;
}
nav.scrolled { box-shadow: 0 2px 16px rgba(26, 26, 46, 0.08); }

.nav-logo { font-size: 18px; font-weight: 800; color: var(--navy); letter-spacing: -0.5px; }

.nav-links { display: flex; gap: 32px; }
.nav-links a { font-size: 13px; font-weight: 500; color: var(--text-3); text-decoration: none; transition: color 0.2s; }
.nav-links a:hover { color: var(--navy); }

.nav-cta {
  background: var(--navy);
  color: white;
  font-size: 13px;
  font-weight: 600;
  padding: 9px 20px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
}
.nav-cta:hover { background: var(--navy-2); transform: translateY(-1px); }
```

- [ ] **Step 3: Verify scroll shadow JS**

Inside `<script>` at bottom of body:
```js
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });
```

- [ ] **Step 4: Verify in browser**

- Nav sticks to top when scrolling
- Shadow appears after scrolling past 10px
- "Get in Touch" scrolls to contact section
- "About", "Experience", "Skills" scroll to correct sections

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: sticky nav with scroll shadow"
```

---

## Task 3: Hero Section

**Files:**
- Modify: `index.html` (hero HTML + CSS)

- [ ] **Step 1: Verify hero HTML**

```html
<section id="hero">
  <div class="hero-inner">

    <div class="hero-left">
      <div class="hero-badge reveal">
        <span class="status-dot"></span>
        Open to opportunities
      </div>
      <h1 class="hero-name reveal reveal-d1">Hafizh Fauzan</h1>
      <div class="hero-title reveal reveal-d2">Credit Risk Data Scientist</div>
      <p class="hero-desc reveal reveal-d2">
        4+ years building regulatory-grade scorecards and ML models on national-scale credit data.
        Specialized in risk strategy, feature engineering, and translating complex data insights
        for financial institutions.
      </p>
      <div class="hero-btns reveal reveal-d3">
        <a href="Resume Hafizh Fauzan.pdf" class="btn-primary" download>Download Resume</a>
        <a href="#experience" class="btn-secondary">View Experience</a>
      </div>
    </div>

    <div class="hero-right reveal reveal-d2">
      <div class="photo-circle">
        <img src="Pas Photo Formal.jpg" alt="Hafizh Fauzan"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
        <div class="photo-fallback" style="display:none">HF</div>
      </div>
      <div class="hero-chips">
        <span class="chip">Python</span>
        <span class="chip">PySpark</span>
        <span class="chip">SQL</span>
        <span class="chip">ML</span>
      </div>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Verify hero CSS**

```css
#hero {
  background: linear-gradient(135deg, #f8f9ff 0%, #eef0f8 100%);
  padding: 80px 48px 72px;
}
.hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
}
.hero-left { flex: 1; }

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid var(--border);
  color: var(--text-2);
  font-size: 12px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
  animation: pulse 2.5s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2); }
  50%       { box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.08); }
}

.hero-name {
  font-size: clamp(40px, 5.5vw, 64px);
  font-weight: 800;
  color: var(--navy);
  line-height: 1.05;
  letter-spacing: -1.5px;
  margin-bottom: 14px;
}
.hero-title { font-size: 16px; font-weight: 500; color: var(--text-2); margin-bottom: 20px; }
.hero-desc {
  font-size: 14px;
  color: var(--text-3);
  line-height: 1.8;
  max-width: 460px;
  margin-bottom: 36px;
}

.hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--navy); color: white;
  font-size: 13px; font-weight: 600;
  padding: 12px 22px; border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
}
.btn-primary:hover { background: var(--navy-2); transform: translateY(-1px); }
.btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: var(--navy);
  border: 2px solid var(--navy);
  font-size: 13px; font-weight: 600;
  padding: 10px 22px; border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
}
.btn-secondary:hover { background: rgba(26, 26, 46, 0.05); transform: translateY(-1px); }

.hero-right { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 20px; }

.photo-circle {
  width: 220px; height: 220px;
  border-radius: 50%;
  border: 4px solid var(--navy);
  overflow: hidden;
  background: var(--bg-3);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 32px rgba(26, 26, 46, 0.15);
}
.photo-circle img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.photo-fallback { font-size: 48px; font-weight: 800; color: var(--navy); }

.hero-chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.chip {
  background: white; border: 1px solid var(--border);
  color: var(--navy); font-size: 12px; font-weight: 600;
  padding: 5px 12px; border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
```

- [ ] **Step 3: Verify in browser**

- Light gradient background
- Name is large, bold, navy
- Status badge shows with pulsing green dot
- Photo is circular with navy border; if image fails to load, "HF" fallback shows
- "Download Resume" triggers a file download
- "View Experience" scrolls to experience section
- Python / PySpark / SQL / ML chips visible below photo

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: hero section — name, photo, CTAs, status badge"
```

---

## Task 4: Key Numbers Bar

**Files:**
- Modify: `index.html` (numbers HTML + CSS + counter JS)

- [ ] **Step 1: Verify numbers HTML**

Place this immediately after the closing `</section>` of hero:
```html
<div id="numbers">
  <div class="numbers-inner">
    <div class="num-item reveal">
      <div class="num-val"><span class="counter" data-target="4">0</span>+</div>
      <div class="num-label">Years Experience</div>
    </div>
    <div class="num-item reveal reveal-d1">
      <div class="num-val"><span class="counter" data-target="100">0</span>M+</div>
      <div class="num-label">Credit Subjects Analyzed</div>
    </div>
    <div class="num-item reveal reveal-d2">
      <div class="num-val"><span class="counter" data-target="30">0</span>+</div>
      <div class="num-label">Financial Institutions</div>
    </div>
    <div class="num-item reveal reveal-d3">
      <div class="num-val">20–30%</div>
      <div class="num-label">Approval Rate Lift</div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Verify numbers CSS**

```css
#numbers {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: white;
}
.numbers-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.num-item {
  padding: 36px 28px;
  border-right: 1px solid var(--border);
  transition: background 0.2s;
}
.num-item:last-child { border-right: none; }
.num-item:hover { background: var(--bg-2); }
.num-val {
  font-size: 40px; font-weight: 800;
  color: var(--navy); line-height: 1;
  letter-spacing: -1px; margin-bottom: 8px;
}
.num-label { font-size: 12px; font-weight: 500; color: var(--text-3); line-height: 1.5; }
```

- [ ] **Step 3: Verify counter animation JS**

Inside `<script>`:
```js
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    const duration = 1000;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));
```

- [ ] **Step 4: Verify in browser**

- 4 columns separated by thin dividers
- Numbers count up from 0 when the bar scrolls into view
- "20–30%" displays as static text (no counter — correct)
- Hover on any cell shows a subtle background change

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: key numbers bar with counter animation"
```

---

## Task 5: About Section

**Files:**
- Modify: `index.html` (about HTML + CSS)

- [ ] **Step 1: Verify about HTML**

```html
<section id="about">
  <div class="about-inner">

    <div class="about-left">
      <div class="label-tag reveal">About</div>
      <h2 class="section-title reveal reveal-d1">Professional Summary</h2>
      <p class="about-text reveal reveal-d2">
        Credit Risk Data Scientist with <strong>4+ years of experience</strong> across Banking, Multi-Finance,
        and Credit Bureau sectors. Specialized in building <strong>regulatory-grade Scorecards and ML models</strong>
        on massive datasets (100M+ subjects). Proven track record of leveraging national-scale credit data to drive
        <strong>risk strategy and revenue growth</strong>. Led cross-functional teams to boost leads.
        Proficient in <strong>Python, SQL, PySpark, and ML</strong>, focusing on actionable insights.
        Demonstrated leadership in data forums and bridging technical-business communication.
      </p>
    </div>

    <div class="about-right">
      <div class="label-tag reveal">Sectors</div>
      <div class="sector-list">
        <div class="sector-item reveal reveal-d1">Credit Bureau</div>
        <div class="sector-item reveal reveal-d2">Multi-Finance</div>
        <div class="sector-item reveal reveal-d3">Banking</div>
        <div class="sector-item reveal reveal-d4">BNPL / Personal Loan</div>
      </div>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Verify about CSS**

```css
/* Shared label-tag used across all sections */
.label-tag {
  display: inline-block;
  background: var(--navy);
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  padding: 4px 10px; border-radius: 4px;
  margin-bottom: 14px;
}
.section-title {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800; color: var(--navy);
  letter-spacing: -0.5px; line-height: 1.2;
}

#about { padding: 96px 48px; background: var(--bg); }
.about-inner {
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 260px;
  gap: 80px; align-items: start;
}
.about-left .label-tag { margin-bottom: 14px; }
.about-left .section-title { margin-bottom: 22px; }
.about-text { font-size: 14.5px; color: var(--text-2); line-height: 1.85; }
.about-text strong { color: var(--navy); font-weight: 600; }

.sector-list { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
.sector-item {
  background: var(--bg-2);
  border-left: 3px solid var(--navy);
  padding: 10px 14px;
  font-size: 13px; font-weight: 500; color: var(--navy);
  border-radius: 0 6px 6px 0;
  transition: background 0.2s, transform 0.2s;
}
.sector-item:hover { background: var(--bg-3); transform: translateX(3px); }
```

- [ ] **Step 3: Verify in browser**

- White background, two-column layout: bio left, sectors right
- Sector tags have a left navy border accent
- Hovering a sector tag slides it 3px right
- Bold text in bio renders in navy, not default weight

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: about section — professional summary and sector tags"
```

---

## Task 6: Experience Timeline

**Files:**
- Modify: `index.html` (experience HTML + CSS)

- [ ] **Step 1: Verify experience section HTML**

```html
<section id="experience">
  <div class="experience-inner">
    <div class="label-tag reveal">Experience</div>
    <h2 class="section-title exp-title reveal reveal-d1">Career Timeline</h2>

    <div class="timeline">

      <!-- Role 1: CRIF -->
      <div class="exp-item reveal">
        <div class="exp-left">
          <div class="exp-dot current"></div>
          <div class="exp-line"></div>
        </div>
        <div class="exp-right">
          <div class="exp-company">CRIF Lembaga Informasi Keuangan</div>
          <div class="exp-meta">
            <span class="exp-role">Senior Analytics Consultant</span>
            <span class="exp-date">Jan 2024 — Present</span>
            <span class="exp-current-tag">Current</span>
          </div>
          <ul class="exp-bullets">
            <li>Developed and delivered multiple <strong>behavioral Scorecard models</strong> on the entire Indonesian credit data, combined with Telco data, on <strong>100+ million subjects</strong>.</li>
            <li>Built a <strong>high-dimensional feature store of 15,000+ derived attributes</strong> from raw SLIK data. Applied IV binning, missing value imputation, and feature clustering to reduce dimensionality to ~100 predictive features.</li>
            <li>Led the <strong>full model lifecycle PoC</strong> for 30+ major financial institutions — from segmentation analysis to model deployment. Established automated monitoring using PSI and GINI to detect model drift.</li>
            <li>Conducted <strong>Cut-Off analysis and Reject Inference</strong> to optimize risk strategy, achieving <strong>20–30% higher approval rates</strong> while maintaining flat NPL rates.</li>
            <li>Presented proof-of-concept solutions to key executives at <strong>50+ large financial institutions</strong>.</li>
            <li>Collaborated with the <strong>International CRIF team</strong> on Application, Behavioral, and Collection scorecards.</li>
            <li>Executed high-value <strong>market research projects</strong> (worth billions IDR) on Credit Card, BNPL, Personal Loan, and more.</li>
            <li>Served as <strong>acting Technical Lead</strong> for a squad of 3+ Analytics Consultants and Interns — conducting code reviews, overseeing delivery quality, and mentoring juniors.</li>
            <li>Created and maintained <strong>data-driven dashboards</strong> providing clients with real-time strategic insights.</li>
          </ul>
        </div>
      </div>

      <!-- Role 2: Astra Financial -->
      <div class="exp-item reveal">
        <div class="exp-left">
          <div class="exp-dot"></div>
          <div class="exp-line"></div>
        </div>
        <div class="exp-right">
          <div class="exp-company">Astra Financial</div>
          <div class="exp-meta">
            <span class="exp-role">Data Scientist</span>
            <span class="exp-date">Nov 2022 — Jan 2024</span>
          </div>
          <ul class="exp-bullets">
            <li>Led a major <strong>cross-sell and upsell project</strong>, driving a <strong>78% increase in valid leads</strong> and a <strong>35% rise in GMV</strong> across FIFGROUP, Astra Credit Companies, and Toyota Astra Financial Services.</li>
            <li>Led the <strong>Data Analytics Forum</strong> for Astra Financial and its subsidiaries, fostering collaboration and knowledge-sharing across data teams.</li>
            <li>Managed <strong>end-to-end ML model development</strong> for predictive analysis, improving targeting strategies and driving business growth.</li>
            <li>Collaborated with product and marketing teams to deliver <strong>actionable insights</strong> based on customer behavior.</li>
          </ul>
        </div>
      </div>

      <!-- Role 3: Bank Sinarmas -->
      <div class="exp-item reveal">
        <div class="exp-left">
          <div class="exp-dot"></div>
        </div>
        <div class="exp-right">
          <div class="exp-company">Bank Sinarmas</div>
          <div class="exp-meta">
            <span class="exp-role">Data Scientist → Data Science Graduate Camp (MT)</span>
            <span class="exp-date">Jun 2021 — Nov 2022</span>
          </div>
          <ul class="exp-bullets">
            <li>Led development of a <strong>customer segmentation model</strong> using PySpark and Apache Spark, improving targeting capabilities.</li>
            <li>Delivered <strong>explainable AI solutions</strong>, enabling stakeholders to understand model outputs and make confident data-driven decisions.</li>
            <li>Presented comprehensive findings to <strong>senior leadership</strong>, translating complex data insights into actionable strategies.</li>
            <li>Led a key segmentation project resulting in improved marketing and product targeting strategies.</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify experience CSS**

```css
#experience {
  padding: 96px 48px;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.experience-inner { max-width: 1100px; margin: 0 auto; }
.experience-inner .label-tag { display: block; margin-bottom: 14px; }
.section-title.exp-title { margin-bottom: 56px; }

.timeline { display: flex; flex-direction: column; }
.exp-item { display: flex; gap: 32px; padding-bottom: 48px; }
.exp-item:last-child { padding-bottom: 0; }

.exp-left { display: flex; flex-direction: column; align-items: center; width: 20px; flex-shrink: 0; }
.exp-dot {
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--border-2);
  border: 2px solid white;
  box-shadow: 0 0 0 2px var(--border-2);
  flex-shrink: 0; margin-top: 5px;
}
.exp-dot.current {
  background: var(--green);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
}
.exp-line { flex: 1; width: 2px; background: var(--border); margin: 8px 0 0; }
.exp-item:last-child .exp-line { display: none; }

.exp-right { flex: 1; }
.exp-company { font-size: 17px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
.exp-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
.exp-role { font-size: 13px; font-weight: 500; color: var(--text-2); font-style: italic; }
.exp-date {
  font-size: 11px; font-weight: 600; color: var(--text-3);
  background: var(--bg-3); padding: 2px 9px; border-radius: 10px;
}
.exp-current-tag {
  font-size: 10px; font-weight: 700; color: var(--green);
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  padding: 2px 8px; border-radius: 10px; letter-spacing: 0.05em;
}

.exp-bullets { list-style: none; display: flex; flex-direction: column; gap: 7px; }
.exp-bullets li {
  font-size: 13.5px; color: var(--text-2); line-height: 1.65;
  padding-left: 18px; position: relative;
}
.exp-bullets li::before {
  content: '→'; position: absolute; left: 0;
  color: var(--navy); font-size: 11px; font-weight: 700; top: 2px;
}
.exp-bullets li strong { color: var(--navy); font-weight: 600; }
```

- [ ] **Step 3: Verify in browser**

- Subtle grey background (`#f8f9ff`)
- CRIF dot is green with glow; other dots are grey
- Vertical connecting line runs between roles
- Last role has no line below it
- "Current" badge is green with green border
- All bullet points have navy arrow prefix
- Bold text inside bullets renders in navy

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: experience timeline — 3 roles with full content"
```

---

## Task 7: Skills Grid

**Files:**
- Modify: `index.html` (skills HTML + CSS)

- [ ] **Step 1: Verify skills HTML**

```html
<section id="skills">
  <div class="skills-inner">
    <div class="label-tag reveal">Skills</div>
    <h2 class="section-title reveal reveal-d1">Technical Toolkit</h2>
    <div class="skills-grid">

      <div class="skill-group reveal">
        <div class="skill-group-title">Programming</div>
        <div class="skill-tags">
          <span class="skill-tag">Python</span>
          <span class="skill-tag">SQL</span>
          <span class="skill-tag">PySpark</span>
        </div>
      </div>

      <div class="skill-group reveal reveal-d1">
        <div class="skill-group-title">ML & Analytics</div>
        <div class="skill-tags">
          <span class="skill-tag">Predictive Modeling</span>
          <span class="skill-tag">Feature Engineering</span>
          <span class="skill-tag">Risk Analysis</span>
        </div>
      </div>

      <div class="skill-group reveal reveal-d2">
        <div class="skill-group-title">Big Data</div>
        <div class="skill-tags">
          <span class="skill-tag light">Hadoop</span>
          <span class="skill-tag light">Apache Spark</span>
        </div>
      </div>

      <div class="skill-group reveal reveal-d3">
        <div class="skill-group-title">Visualization & Tools</div>
        <div class="skill-tags">
          <span class="skill-tag light">Tableau</span>
          <span class="skill-tag light">Power BI</span>
          <span class="skill-tag light">Git</span>
          <span class="skill-tag light">MS Excel</span>
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify skills CSS**

```css
#skills { padding: 96px 48px; background: var(--bg); }
.skills-inner { max-width: 1100px; margin: 0 auto; }
.skills-inner .label-tag { display: block; margin-bottom: 14px; }
.skills-inner .section-title { margin-bottom: 40px; }

.skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.skill-group {
  background: var(--bg-2); border: 1px solid var(--border);
  padding: 24px 22px; border-radius: 12px;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.skill-group:hover { box-shadow: 0 4px 16px rgba(26, 26, 46, 0.08); border-color: var(--border-2); }

.skill-group-title {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--text-3); margin-bottom: 14px;
}
.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-tag {
  background: var(--navy); color: white;
  font-size: 12px; font-weight: 600;
  padding: 5px 13px; border-radius: 6px;
}
.skill-tag.light { background: var(--bg-3); color: var(--navy); }
```

- [ ] **Step 3: Verify in browser**

- 2×2 grid of skill cards on white background
- Programming and ML & Analytics tags: dark navy fill, white text
- Big Data and Tools tags: light grey fill, navy text
- Card lifts slightly on hover (box-shadow appears)

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: skills grid — 4 categories, dark/light tag variants"
```

---

## Task 8: Contact Section & Footer

**Files:**
- Modify: `index.html` (contact + footer HTML + CSS)

- [ ] **Step 1: Verify contact HTML**

```html
<section id="contact">
  <div class="contact-inner">
    <div class="label-tag reveal">Contact</div>
    <h2 class="section-title reveal reveal-d1">Let's Work Together</h2>
    <p class="contact-subtext reveal reveal-d2">
      Available for consulting engagements, full-time roles, and advisory work
      in credit risk &amp; data science.
    </p>
    <div class="contact-cards">
      <a href="mailto:hayeef8@gmail.com" class="contact-card reveal">
        <div class="contact-icon">📧</div>
        <div class="contact-info">
          <div class="contact-type">Email</div>
          <div class="contact-value">hayeef8@gmail.com</div>
        </div>
      </a>
      <a href="tel:+6281221546465" class="contact-card reveal reveal-d1">
        <div class="contact-icon">📞</div>
        <div class="contact-info">
          <div class="contact-type">Phone</div>
          <div class="contact-value">+62 812 2154 6465</div>
        </div>
      </a>
      <a href="https://www.linkedin.com/in/hafizhf/" target="_blank" rel="noopener" class="contact-card reveal reveal-d2">
        <div class="contact-icon">🔗</div>
        <div class="contact-info">
          <div class="contact-type">LinkedIn</div>
          <div class="contact-value">linkedin.com/in/hafizhf</div>
        </div>
      </a>
    </div>
  </div>
</section>

<footer>
  <div class="footer-text">© 2025 Hafizh Fauzan · Jakarta, Indonesia</div>
  <div class="footer-text">Credit Risk Data Scientist</div>
</footer>
```

- [ ] **Step 2: Verify contact + footer CSS**

```css
#contact {
  padding: 96px 48px;
  background: var(--navy);
  color: white;
  text-align: center;
}
.contact-inner { max-width: 700px; margin: 0 auto; }
.contact-inner .label-tag {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 16px;
}
.contact-inner .section-title { color: white; margin-bottom: 14px; }
.contact-subtext { font-size: 14px; color: rgba(255, 255, 255, 0.5); line-height: 1.7; margin-bottom: 44px; }

.contact-cards { display: flex; flex-direction: column; gap: 12px; text-align: left; }
.contact-card {
  display: flex; align-items: center; gap: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 20px; border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.contact-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
.contact-icon { font-size: 18px; width: 40px; text-align: center; flex-shrink: 0; }
.contact-info { flex: 1; }
.contact-type {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4); margin-bottom: 2px;
}
.contact-value { font-size: 14px; font-weight: 500; color: white; }

footer {
  background: #13132a;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 20px 48px;
  display: flex; align-items: center; justify-content: space-between;
}
.footer-text { font-size: 12px; color: rgba(255, 255, 255, 0.3); }
```

- [ ] **Step 3: Verify in browser**

- Dark navy background for the contact section
- Three cards: email, phone, LinkedIn — each lifts on hover
- Clicking the email card opens the mail client
- Clicking the phone card triggers a call (on mobile)
- Clicking LinkedIn opens `https://www.linkedin.com/in/hafizhf/` in a new tab
- Footer text is barely visible (intentionally muted)

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: contact section and footer"
```

---

## Task 9: Scroll Reveal Animations

**Files:**
- Modify: `index.html` (reveal CSS + JS)

- [ ] **Step 1: Verify reveal CSS**

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
}
.reveal.visible { opacity: 1; transform: none; }
.reveal-d1 { transition-delay: 0.08s; }
.reveal-d2 { transition-delay: 0.16s; }
.reveal-d3 { transition-delay: 0.24s; }
.reveal-d4 { transition-delay: 0.32s; }
```

- [ ] **Step 2: Verify reveal JS**

Inside `<script>`:
```js
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObserver.observe(el));

// Trigger hero immediately without waiting for scroll
setTimeout(() => {
  document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));
}, 60);
```

- [ ] **Step 3: Verify in browser**

- On page load: hero content is visible immediately (not hidden)
- Scrolling down: each section's elements fade up into view as they enter the viewport
- Elements with `reveal-d1`, `reveal-d2`, etc. stagger in sequence within each section
- Once revealed, elements stay visible (they do not re-hide on scroll up)

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: scroll reveal animations with stagger delays"
```

---

## Task 10: Responsive Design

**Files:**
- Modify: `index.html` (responsive CSS at end of `<style>` block)

- [ ] **Step 1: Verify responsive CSS is at the very end of the `<style>` block**

```css
/* ── RESPONSIVE ────────────────────────── */
@media (max-width: 860px) {
  nav { padding: 0 20px; }
  .nav-links { display: none; }

  #hero { padding: 64px 20px 56px; }
  .hero-inner { flex-direction: column-reverse; gap: 32px; align-items: center; text-align: center; }
  .hero-desc { max-width: 100%; }
  .hero-btns { justify-content: center; }

  .numbers-inner { grid-template-columns: repeat(2, 1fr); }
  .num-item:nth-child(2) { border-right: none; }

  #about { padding: 64px 20px; }
  .about-inner { grid-template-columns: 1fr; gap: 36px; }

  #experience { padding: 64px 20px; }

  .skills-grid { grid-template-columns: 1fr; }
  #skills { padding: 64px 20px; }

  #contact { padding: 64px 20px; }

  footer { padding: 16px 20px; flex-direction: column; gap: 6px; text-align: center; }
}

@media (max-width: 480px) {
  .photo-circle { width: 160px; height: 160px; }
}
```

- [ ] **Step 2: Verify in browser — mobile (360px wide)**

Use DevTools → Toggle device toolbar → set to 360px wide:
- Nav shows only logo + "Get in Touch" button (links hidden)
- Hero stacks: photo above, text below, both centered
- Numbers show as 2×2 grid
- About stacks: bio full-width, sectors below
- Experience timeline unchanged (works at any width)
- Skills show as single column
- Contact cards stack vertically
- Footer stacks to two centered lines

- [ ] **Step 3: Verify in browser — tablet (768px wide)**

- Hero: photo and text side-by-side (starts stacking below 860px, so at 768px it should be stacked)
- Numbers: 2×2 grid
- All padding reduced

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: responsive design — mobile 360px and tablet breakpoints"
```

---

## Task 11: Accessibility & Final Polish

**Files:**
- Modify: `index.html` (accessibility attributes, focus styles, final review)

- [ ] **Step 1: Add focus-visible styles**

Inside `<style>`:
```css
:focus-visible {
  outline: 2px solid var(--navy);
  outline-offset: 3px;
  border-radius: 3px;
}
a:focus-visible { outline-color: var(--navy); }
```

- [ ] **Step 2: Verify ARIA and semantic attributes**

Check each of the following — add if missing:

- `<nav>` has `aria-label="Main navigation"`
- `<section id="hero">` has `aria-label="Introduction"`
- `<section id="about">` has `aria-label="About"`
- `<section id="experience">` has `aria-label="Experience"`
- `<section id="skills">` has `aria-label="Skills"`
- `<section id="contact">` has `aria-label="Contact"`
- `<img src="Pas Photo Formal.jpg" alt="Hafizh Fauzan" ...>` — alt text already present, confirm
- `.contact-card` links each have descriptive text visible to screen readers (they do — the `.contact-value` text serves this role)

- [ ] **Step 3: Add `lang` attribute to `<html>`**

```html
<html lang="en">
```

- [ ] **Step 4: Verify font preload doesn't block render**

Confirm the Google Fonts `<link>` uses `display=swap` in the URL — this is already in the font URL parameter (`&display=swap`). No change needed if it's there.

- [ ] **Step 5: Verify in browser**

- Tab through the page: focus ring appears on nav links, CTA button, contact cards
- No keyboard trap anywhere
- Page title shows correctly in browser tab: "Hafizh Fauzan — Credit Risk Data Scientist"

- [ ] **Step 6: Final visual check — scroll through entire page**

Confirm all of the following:
- [ ] Status dot pulses green in hero badge
- [ ] Photo loads; if not, "HF" fallback shows
- [ ] "Download Resume" downloads the PDF
- [ ] All nav links scroll to correct sections
- [ ] Numbers count up on scroll
- [ ] Timeline: CRIF dot is green, others are grey
- [ ] Skills: dark tags for Programming/ML, light tags for Big Data/Tools
- [ ] Contact: all three cards open correct link/app
- [ ] LinkedIn opens `https://www.linkedin.com/in/hafizhf/` in new tab

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: accessibility improvements, focus styles, aria labels"
```

---

## Out of Scope

Per the spec — do NOT add:
- Projects / Case Studies section
- Testimonials or client logos
- Dark mode toggle
- Blog or articles
- Multi-language support
- Any JavaScript framework or build step
