# Digital Ocean App Platform Deployment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify and confirm that `hafizhfauzan.com` and `www.hafizhfauzan.com` serve the portfolio over HTTPS via DO App Platform, alongside the existing GitHub Pages deployment at `hayufa12.github.io`.

**Architecture:** DO App Platform uses its native GitHub integration to auto-deploy from `master` — no additional workflow files. GoDaddy DNS routes `www` via CNAME to DO and forwards the bare apex via 301. SSL is auto-provisioned by DO via Let's Encrypt. GitHub Pages continues via the existing `deploy.yml` workflow, untouched.

**Tech Stack:** Vite 8, React 19, Tailwind CSS v3, Digital Ocean App Platform (Static Site), GoDaddy DNS

---

## Configuration Already Completed (reference)

These steps were completed during the design session and do not need to be repeated:

- DO App Platform connected to `hayufa12/hayufa12.github.io` repo, branch `master`, build command `npm run build`, output dir `dist`
- `www.hafizhfauzan.com` added as PRIMARY custom domain in DO App Platform (status: Configuring → will become Active once SSL provisions)
- GoDaddy DNS: `CNAME www → octopus-app-col2r.ondigitalocean.app`
- GoDaddy domain forwarding: `hafizhfauzan.com` → `http://www.hafizhfauzan.com` (301 Permanent)
- No code changes required — `vite.config.js` base is `/` (correct for both deployments)

---

## Task 1: Confirm SSL is Active on DO App Platform

**Files:** None

- [ ] **Step 1: Open DO App Platform dashboard**

  Navigate to your app → Settings → Domains. Wait for `www.hafizhfauzan.com` status to change from **Configuring** to **Active**. This can take up to 30 minutes from when the domain was added.

- [ ] **Step 2: Confirm Active status**

  Both entries should show:
  ```
  octopus-app-col2r.ondigitalocean.app   Redirects to www.hafizhfauzan.com   Active
  www.hafizhfauzan.com                   PRIMARY                              Active
  ```

---

## Task 2: Smoke Test All URLs

**Files:** None — browser-only verification

- [ ] **Step 1: Test primary custom domain (www)**

  Open a browser (or incognito tab to avoid cache) and visit:
  ```
  https://www.hafizhfauzan.com
  ```
  Expected:
  - Page loads with your portfolio (no SSL error, no redirect loop)
  - Padlock icon visible in browser address bar (HTTPS)
  - Content matches what you see at `https://octopus-app-col2r.ondigitalocean.app`

- [ ] **Step 2: Test bare apex domain**

  Visit:
  ```
  https://hafizhfauzan.com
  ```
  Expected:
  - Redirects to `https://www.hafizhfauzan.com` (301)
  - Portfolio loads correctly

  If the browser shows `http://` after redirect rather than `https://`, this is fine — GoDaddy forwarding sends to `http://www` but DO enforces HTTPS at its end via its own redirect. End result should still be HTTPS.

- [ ] **Step 3: Test DO default domain still redirects**

  Visit:
  ```
  https://octopus-app-col2r.ondigitalocean.app
  ```
  Expected: Redirects to `https://www.hafizhfauzan.com`

- [ ] **Step 4: Test GitHub Pages is unaffected**

  Visit:
  ```
  https://hayufa12.github.io
  ```
  Expected: Portfolio loads correctly over HTTPS (unchanged from before)

---

## Task 3: Verify Auto-Deploy on Push

**Files:** None — git + DO dashboard verification

- [ ] **Step 1: Make a trivial commit to master**

  Make a small whitespace or comment change to any source file, then push:
  ```bash
  git add <file>
  git commit -m "chore: trigger deploy test"
  git push origin master
  ```

- [ ] **Step 2: Check GitHub Actions**

  Go to your GitHub repo → Actions tab. Confirm the "Deploy to GitHub Pages" workflow runs and completes successfully.

- [ ] **Step 3: Check DO App Platform deploy**

  Go to DO App Platform → your app → Activity or Deployments tab. Confirm a new deploy was triggered automatically and completes successfully.

- [ ] **Step 4: Revert the trivial commit (optional)**

  If you don't want the test commit in history:
  ```bash
  git revert HEAD --no-edit
  git push origin master
  ```
  This will trigger another deploy — both deployments run cleanly on the revert too.

---

## Task 4: Commit the Plan

**Files:**
- Already exists: `docs/superpowers/plans/2026-04-15-digital-ocean-deploy.md`

- [ ] **Step 1: Commit the plan file**

  ```bash
  git add docs/superpowers/plans/2026-04-15-digital-ocean-deploy.md
  git commit -m "docs: add Digital Ocean App Platform deployment implementation plan"
  git push origin master
  ```

---

## Definition of Done

- [ ] `https://www.hafizhfauzan.com` serves the portfolio over HTTPS
- [ ] `https://hafizhfauzan.com` redirects to `www` and loads the portfolio
- [ ] `https://hayufa12.github.io` still works (GitHub Pages unaffected)
- [ ] A push to `master` triggers auto-deploy on both DO App Platform and GitHub Actions
- [ ] No code changes were made to the repository source files
