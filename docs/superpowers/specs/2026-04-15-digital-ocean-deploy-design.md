# Digital Ocean App Platform Deployment — Design Spec
**Date:** 2026-04-15
**Subject:** Deploy Hafizh Fauzan portfolio to `https://www.hafizhfauzan.com` via Digital Ocean App Platform, alongside existing GitHub Pages deployment.

---

## Overview

Deploy the Vite + React portfolio to Digital Ocean App Platform as the primary public URL at `https://www.hafizhfauzan.com`, with `hafizhfauzan.com` (bare apex) 301-redirecting to `www` via GoDaddy domain forwarding. The existing GitHub Pages deployment at `https://hayufa12.github.io` continues unchanged as a free backup. No code changes to the repository.

---

## Architecture

```
push to master
    │
    ├── GitHub Actions (deploy.yml) ──────► hayufa12.github.io  (backup)
    │
    └── DO App Platform (native) ─────────► www.hafizhfauzan.com  (primary)
                                                  │
                                            SSL: Let's Encrypt (auto, DO-managed)
                                            DNS: GoDaddy CNAME → DO
```

Both deployments trigger independently from `master`. DO App Platform uses its native GitHub integration — no additional workflow files or GitHub secrets required.

---

## Decisions

| Question | Decision |
|---|---|
| DO product | App Platform — Static Site (free tier) |
| Primary URL | `www.hafizhfauzan.com` |
| Bare apex handling | GoDaddy domain forwarding → 301 → `www.hafizhfauzan.com` |
| SSL | Let's Encrypt, auto-provisioned by DO |
| GitHub Pages | Unchanged, remains at `hayufa12.github.io` |
| Code changes | None — `vite.config.js` base stays `/` |
| Deployment trigger | Native DO GitHub integration (auto-deploy on push to `master`) |

---

## DO App Platform Configuration

- **App:** `octopus-app-col2r.ondigitalocean.app`
- **Repo:** `hayufa12/hayufa12.github.io`, branch `master`
- **Component type:** Static Site
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Custom domains:**
  - `www.hafizhfauzan.com` (PRIMARY)
  - Default domain redirects to `www.hafizhfauzan.com` (configured automatically by DO)

SSL is provisioned automatically by DO via Let's Encrypt once the CNAME is verified. No manual certificate management required.

---

## DNS Configuration (GoDaddy)

| Record | Type | Name | Value |
|---|---|---|---|
| Forwarding (apex) | 301 Permanent | `hafizhfauzan.com` | `http://www.hafizhfauzan.com` |
| Apex forwarding IPs | A (auto, read-only) | `@` | `15.197.142.173`, `3.33.152.147` (GoDaddy forwarding service) |
| www | CNAME | `www` | `octopus-app-col2r.ondigitalocean.app` |

**Note:** GoDaddy does not support CNAME on the apex (`@`). The A records pointing to GoDaddy's forwarding IPs are auto-managed by GoDaddy's forwarding service and cannot be edited directly. The domain forwarding rule handles the apex → www redirect.

**Note:** DO's suggestion to "set DNS to DigitalOcean's nameservers" is not required. The CNAME-based setup with GoDaddy's nameservers is sufficient.

---

## End State

| URL | Behaviour |
|---|---|
| `https://www.hafizhfauzan.com` | Serves portfolio from DO App Platform over HTTPS |
| `https://hafizhfauzan.com` | 301 → `https://www.hafizhfauzan.com` |
| `https://hayufa12.github.io` | Serves portfolio from GitHub Pages (backup, unchanged) |
| `https://octopus-app-col2r.ondigitalocean.app` | Redirects to `www.hafizhfauzan.com` |

---

## Out of Scope

- Transferring DNS management to Digital Ocean nameservers
- Preview deployments for pull requests
- Deploy notifications (Slack, email)
- Custom domain on GitHub Pages (`hayufa12.github.io` stays as-is)
- Any CDN or caching layer beyond what DO App Platform provides by default
