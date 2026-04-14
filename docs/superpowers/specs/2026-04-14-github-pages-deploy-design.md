# GitHub Pages Deployment — Design Spec
**Date:** 2026-04-14
**Subject:** Publish Hafizh Fauzan portfolio to `https://hayufa12.github.io/` via GitHub Actions

---

## Overview

Publish the Vite + React portfolio to GitHub Pages as a user page at `https://hayufa12.github.io/`. Deployment is automated via GitHub Actions — every push to `master` triggers a build-and-deploy workflow. No manual deployment steps after initial setup.

---

## Decisions

| Question | Decision |
|---|---|
| GitHub Pages URL | `https://hayufa12.github.io/` (user page) |
| Repo name | Rename `Portfolio_DS` → `hayufa12.github.io` |
| Deployment mechanism | GitHub Actions (automated) |
| Pages source | "GitHub Actions" (not branch-based) |
| `vite.config.js` base | `/` — no change needed (user page serves from root) |
| Node version | 20 |

---

## Repo Rename

Rename the GitHub repository from `Portfolio_DS` to `hayufa12.github.io` via GitHub Settings → General → Repository name.

After renaming, update the local remote URL:

```bash
git remote set-url origin https://github.com/hayufa12/hayufa12.github.io.git
```

This is required for GitHub to serve the site at `https://hayufa12.github.io/`. A repo named anything else would be served at `https://hayufa12.github.io/<repo-name>/` (project page).

---

## GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

Two jobs:

### `build` job
1. Checkout code (`actions/checkout@v4`)
2. Setup Node 20 (`actions/setup-node@v4` with npm cache)
3. `npm ci`
4. `npm run build` → outputs `dist/`
5. Upload `dist/` as Pages artifact (`actions/upload-pages-artifact@v3`)

### `deploy` job
- Depends on `build` job completing successfully
- Deploys the artifact to the GitHub Pages environment (`actions/deploy-pages@v4`)
- Runs on `ubuntu-latest`

### Trigger
```yaml
on:
  push:
    branches: [master]
```

### Permissions
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

`pages: write` and `id-token: write` are required by `actions/deploy-pages`.

### Concurrency
```yaml
concurrency:
  group: pages
  cancel-in-progress: true
```

Prevents two deployments running simultaneously — if a new push arrives while a deploy is in progress, the old one is cancelled.

---

## GitHub Pages Settings (Manual)

After pushing the workflow file:

1. Go to repo **Settings → Pages**
2. Set **Source** to **"GitHub Actions"**

This must be done once. Without it, GitHub ignores the workflow and looks for a branch instead.

---

## Files Changed

| File | Change |
|---|---|
| `.github/workflows/deploy.yml` | **New** — automated build + deploy workflow |

No changes to `vite.config.js`, `package.json`, or any source files.

---

## Out of Scope

- Custom domain (e.g. `hafizh.com`)
- Preview deployments for pull requests
- Deploy notifications (Slack, email)
- Caching `node_modules` across runs (npm cache via `actions/setup-node` is sufficient)
