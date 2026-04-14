# GitHub Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the portfolio to `https://hayufa12.github.io/` with automated deployment on every push to `master`.

**Architecture:** A GitHub Actions workflow builds the Vite app and deploys `dist/` to GitHub Pages on every push to `master`. Two one-time manual steps required: rename the repo on GitHub and enable GitHub Actions as the Pages source.

**Tech Stack:** GitHub Actions, Vite 8, Node 20, `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`

---

## File Map

| File | Change |
|---|---|
| `.github/workflows/deploy.yml` | **New** — build + deploy workflow |

No other files change.

---

## Task 1: Rename repo on GitHub (manual)

This must be done before pushing the workflow — GitHub only serves user pages from a repo named `<username>.github.io`.

- [ ] **Step 1: Rename the repo**

  Go to `https://github.com/hayufa12/Portfolio_DS/settings`

  Under **General → Repository name**, change `Portfolio_DS` to `hayufa12.github.io` and click **Rename**.

- [ ] **Step 2: Update local remote URL**

  ```bash
  git remote set-url origin https://github.com/hayufa12/hayufa12.github.io.git
  ```

- [ ] **Step 3: Verify remote is updated**

  ```bash
  git remote -v
  ```

  Expected:
  ```
  origin  https://github.com/hayufa12/hayufa12.github.io.git (fetch)
  origin  https://github.com/hayufa12/hayufa12.github.io.git (push)
  ```

---

## Task 2: Create GitHub Actions workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create the workflow file**

  Create `.github/workflows/deploy.yml` with the following content:

  ```yaml
  name: Deploy to GitHub Pages

  on:
    push:
      branches: [master]
    workflow_dispatch:

  permissions:
    contents: read
    pages: write
    id-token: write

  concurrency:
    group: pages
    cancel-in-progress: true

  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - name: Checkout
          uses: actions/checkout@v4

        - name: Setup Node
          uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: npm

        - name: Install dependencies
          run: npm ci

        - name: Build
          run: npm run build

        - name: Upload Pages artifact
          uses: actions/upload-pages-artifact@v3
          with:
            path: dist

    deploy:
      needs: build
      runs-on: ubuntu-latest
      environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
      steps:
        - name: Deploy to GitHub Pages
          id: deployment
          uses: actions/deploy-pages@v4
  ```

- [ ] **Step 2: Commit and push**

  ```bash
  git add .github/workflows/deploy.yml
  git commit -m "ci: add GitHub Actions deploy workflow"
  git push
  ```

- [ ] **Step 3: Verify push succeeded**

  ```bash
  git status
  ```

  Expected: `nothing to commit, working tree clean`

---

## Task 3: Enable GitHub Pages (manual)

GitHub Pages won't serve the deployment until the source is set to "GitHub Actions".

- [ ] **Step 1: Enable GitHub Pages**

  Go to `https://github.com/hayufa12/hayufa12.github.io/settings/pages`

  Under **Build and deployment → Source**, select **GitHub Actions**.

  Click **Save**.

- [ ] **Step 2: Verify the workflow ran**

  Go to `https://github.com/hayufa12/hayufa12.github.io/actions`

  You should see a workflow run triggered by the push in Task 2. Wait for both the `build` and `deploy` jobs to show green checkmarks.

  If the workflow hasn't run yet, trigger it manually: click **Run workflow** → **Run workflow**.

- [ ] **Step 3: Verify the live site**

  Open `https://hayufa12.github.io/` in a browser.

  Expected: portfolio loads with Hero section, Key Numbers, About, Experience, Skills, Projects, Contact all visible. Navbar scroll links work. "Download Resume" button downloads the PDF.

---

## Self-Review

**Spec coverage:**
- [x] Repo renamed to `hayufa12.github.io` → Task 1
- [x] Local remote URL updated → Task 1
- [x] GitHub Actions workflow with `build` + `deploy` jobs → Task 2
- [x] Node 20, `npm ci`, `npm run build`, `dist/` artifact → Task 2
- [x] `pages: write`, `id-token: write` permissions → Task 2
- [x] Concurrency group → Task 2
- [x] Pages source set to "GitHub Actions" → Task 3
- [x] Live site verification → Task 3

**Placeholder scan:** None found. All steps have exact URLs, commands, and expected output.

**Type consistency:** N/A — no code types involved, only YAML config.
