# Portfolio Landing Page — Design Spec
**Date:** 2026-04-10  
**Subject:** Hafizh Fauzan — Credit Risk Data Scientist Portfolio

---

## Overview

A single-page portfolio landing page for Hafizh Fauzan, a Credit Risk Data Scientist with 4+ years of experience. The page serves two primary audiences: recruiters evaluating candidates, and financial institution clients evaluating consulting partnerships. The design is clean, professional, and credibility-focused.

---

## Design Decisions

| Dimension | Decision |
|---|---|
| Visual style | Clean & Professional — light background, navy (#1a1a2e) accents, sans-serif typography |
| Audience | Dual — recruiters + potential clients/financial institutions |
| Layout | Single-page scroll, sections linked from nav |
| Hero layout | Split: text left, circular profile photo right |
| Contact | Email + Phone + LinkedIn |
| Photo | `Pas Photo Formal.jpg` (in project root) |

---

## Sections

### 1. Navigation (Sticky)
- Left: Logo monogram `HF`
- Center: `About` · `Experience` · `Skills` (smooth-scroll anchor links)
- Right: `Get in Touch` CTA button (scrolls to Contact)
- Behavior: sticky on scroll, subtle shadow appears on scroll

### 2. Hero
- **Left column:**
  - "Open to opportunities" badge with green dot
  - Name: `Hafizh Fauzan` (large, bold)
  - Title: `Credit Risk Data Scientist`
  - Short tagline (2–3 sentences, drawn from professional summary)
  - Two CTAs: `Download Resume` (primary, dark fill) · `View Experience` (secondary, outline)
- **Right column:**
  - Circular profile photo (`Pas Photo Formal.jpg`) with navy border
  - Skill chips below photo: `Python` · `PySpark` · `SQL` · `ML`
- Background: subtle light gradient (`#f8f9ff → #eef0f8`)

### 3. Key Numbers (Full-width stat bar)
4-column grid, separated by thin dividers:
| Stat | Label |
|---|---|
| 4+ | Years Experience |
| 100M+ | Credit Subjects Analyzed |
| 30+ | Financial Institutions |
| 20–30% | Approval Rate Lift |

### 4. About
- **Left:** Label tag + `Professional Summary` heading + full professional summary text (verbatim from resume)
- **Right:** Sector tags with left navy border accent: `Credit Bureau` · `Multi-Finance` · `Banking` · `BNPL / Personal Loan`

### 5. Experience (Timeline)
Vertical timeline with dot indicators. Green dot for current role.

**CRIF Lembaga Informasi Keuangan** — *Senior Analytics Consultant* — Jan 2024–Present
- Behavioral Scorecard models on 100M+ subjects (entire Indonesian credit + Telco data)
- Feature store of 15,000+ derived attributes; reduced to ~100 predictive features via IV binning, imputation, feature clustering
- Led full model lifecycle PoC for 30+ major institutions; PSI & GINI monitoring frameworks
- Cut-Off analysis & Reject Inference → 20–30% approval rate lift, flat NPL
- Presented to executives at 50+ financial institutions
- Collaborated with International CRIF team on Application, Behavioral, and Collection scorecards
- Executed market research projects (billions IDR) across Credit Card, BNPL, Personal Loan
- Acting Technical Lead: code reviews, delivery quality, mentoring 3+ consultants/interns
- Data-driven dashboards for real-time client strategic insights

**Astra Financial** — *Data Scientist* — Nov 2022–Jan 2024
- Cross-sell/upsell project: 78% increase in valid leads, 35% GMV rise across FIFGROUP, Astra Credit Companies, Toyota Astra Financial Services
- Led Data Analytics Forum for Astra Financial and subsidiaries
- End-to-end ML model development for predictive analysis
- Actionable insights for product and marketing teams based on customer behavior

**Bank Sinarmas** — *Data Scientist → Data Science Graduate Camp (MT)* — Jun 2021–Nov 2022
- Customer segmentation model using PySpark and Apache Spark
- Explainable AI solutions for stakeholder confidence
- Findings presented to senior leadership; insights translated into strategy
- Key segmentation project improving marketing and product targeting

### 6. Skills (2×2 grid)
| Category | Skills |
|---|---|
| Programming | Python · SQL · PySpark |
| ML & Analytics | Predictive Modeling · Feature Engineering · Risk Analysis |
| Big Data | Hadoop · Apache Spark |
| Visualization & Tools | Tableau · Power BI · Git · MS Excel |

### 7. Contact (Dark footer)
- Background: `#1a1a2e`
- Heading: `Let's Work Together`
- Subtext: Available for consulting, full-time roles, and advisory work in credit risk & data science
- Contact cards: 📧 `hayeef8@gmail.com` · 📞 `+62 812 2154 6465` · 🔗 [LinkedIn](https://www.linkedin.com/in/hafizhf/)

---

## Technical Spec

- **Stack:** Pure HTML + CSS + minimal vanilla JS (no frameworks)
- **Single file:** `index.html` — self-contained, no build step required
- **Font:** System sans-serif stack (`'Segoe UI', system-ui, sans-serif`) — no external font dependency, or optionally Google Fonts `Inter`
- **Color palette:**
  - Primary dark: `#1a1a2e`
  - Background: `#ffffff` / `#f8f9ff`
  - Accent bg: `#eef0f8`
  - Body text: `#4a5568`
  - Muted text: `#718096`
  - Green (active): `#22c55e`
- **Responsive:** Mobile-friendly — hero stacks vertically on small screens, numbers become 2×2, timeline stays single-column
- **Animations:** Subtle fade-in-up on scroll for sections (Intersection Observer), counter animation for Key Numbers
- **Assets:** `Pas Photo Formal.jpg` referenced from project root

---

## Out of Scope

- Projects / Case Studies section (not included per user decision — Focused layout chosen)
- Testimonials / client logos
- Blog or articles
- Dark mode toggle
- Multi-language support
