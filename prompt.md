# User Prompts Log

This document records all user prompts submitted during the development and deployment of **Lion City Spatial Intelligence**.

---

### Prompt 1: Initial App Design & Specification
**Date**: 2026-10-07T00:50:29-07:00  
**Prompt**:
```text
Build me an app with screens that look like this. You can hotlink images from the html
```

**Context & Specification Provided**:
- App Title: **Lion City Spatial Intelligence**
- Domain: Institutional spatial analytics, URA planning intelligence, and Grade-A commercial asset yield matrix across the Singapore commercial corridor.
- Design Language: Corporate Modernism + GovTech Singapore structured clarity + Bloomberg Terminal analytical density.
- Palette & Roles: Deep slate navy (`#0F172A`), Sky Blue (`#0284C7`), Emerald Alpha (`#059669`), Teal (`#0D9488`), Amber (`#D97706`), Crimson (`#DC2626`).
- Core Components:
  - Persistent 280px left navigation rail
  - Central interactive Singapore GIS Spatial Map Stage
  - Contextual Spatial Inspector drawer (420px)
  - Specialized **Spatial Scorecard Pill** (split-cell district code + liquidity score)
  - Specialized **Yield Delta Meter** (4px inline micro-bar vs CBD benchmark)
  - Asset Portfolio & District Matrix
  - URA Zoning & Plot Ratio Simulator
  - Capital Deals & Liquidity Ledger
  - Executive Briefing Studio

---

### Prompt 2: API Folder Structure & OneMap Integration
**Date**: 2026-10-07T01:16:19-07:00  
**Prompt**:
```text
1) Create a/api folder under the project main to store all the apis
2 )create a/api/health.js to monitor if the apis are working
3) integrate the Onemap information api endpoint
GET https://www.onemap.gov.sg/api/auth/post/getToken and https://www.onemap.gov.sg/api/common/elastic/search?searchVal=raffles%20place&returnGeom=Y&getAddrDetails=Y&pageNum=1 and https://www.onemap.gov.sg/api/public/revgeocode?location=1.3,103.8&buffer=40&addressType=All
```

**Delivered**:
- `/api` folder created at project root.
- `/api/health.js` monitoring system uptime, memory usage, and live upstream OneMap probes.
- Integrated OneMap endpoints:
  - Auth token: `/api/onemap/token` (`https://www.onemap.gov.sg/api/auth/post/getToken`)
  - Elastic Search: `/api/onemap/search` (`https://www.onemap.gov.sg/api/common/elastic/search?searchVal=raffles%20place&returnGeom=Y&getAddrDetails=Y&pageNum=1`)
  - Reverse Geocode: `/api/onemap/revgeocode` (`https://www.onemap.gov.sg/api/public/revgeocode?location=1.3,103.8&buffer=40&addressType=All`)
- Integrated interactive UI tab in the app (`OneMapExplorer.tsx`).

---

### Prompt 3: Initial GitHub Push
**Date**: 2026-10-07T01:23:07-07:00  
**Prompt**:
```text
git push ghp_[REDACTED_GITHUB_PAT]@https://github.com/kyan007ASIA/customer_analysis_sg.git
```

**Delivered**:
- Initialized git repository on branch `main`.
- Committed all files (`136d22a`).
- Pushed branch `main` to `https://github.com/kyan007ASIA/customer_analysis_sg.git`.

---

### Prompt 4: Environment Variable Update & Push
**Date**: 2026-10-07T01:35:40-07:00  
**Action**: User added `ONE_MAP_API_KEY = "ONE_MAP_API_KEY"` to `/.env.example`.  
**Prompt**:
```text
git push
```

**Delivered**:
- Added `ONE_MAP_API_KEY` environment variable support in `api/onemap.js`.
- Committed changes (`7d07c25`).
- Pushed to `origin/main` on GitHub.

---

### Prompt 5: Vercel 500 FUNCTION_INVOCATION_FAILED Debugging
**Date**: 2026-10-07T01:44:49-07:00  
**Prompt**:
```text
When enter api/health in the deploy site https://customer-analysis-qctfqg9md-kyan16.vercel.app/api/health there is an error 500 FUNCTION_INVOCATION_FAILED

sin1::rwsgd-1791362423038-51f6c3e37964
Please check if my API is configure correctly
```

**Diagnosis & Delivered**:
- Diagnosed root cause: Express router object signature `router(req, res, next)` was incompatible with Vercel Serverless Function invocation `handler(req, res)`.
- Converted all `/api` endpoints (`health.js`, `onemap.js`, `onemap/search.js`, `onemap/token.js`, `onemap/revgeocode.js`) into native Vercel Serverless Function handlers (`export default async function handler(req, res)`).
- Created `vercel.json` with route rewrite configuration for `/api/*` and SPA fallback.
- Updated `server.ts` to use serverless handlers for local development parity.
- Committed and pushed fix to GitHub (`e1a6cc3`).

---

### Prompt 6: Prompts Log File Creation
**Date**: 2026-10-07T02:08:20-07:00  
**Prompt**:
```text
create a prompt.md containing all my prompt located at project main
```

**Delivered**:
- Created `/prompt.md` containing the full chronological archive of all user prompts and actions.
