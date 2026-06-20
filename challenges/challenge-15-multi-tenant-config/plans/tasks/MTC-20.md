# MTC-20. Deploy frontend to Vercel and smoke test

## Requirement

The Next.js frontend is deployed to Vercel, pointed at the live Fly.io backend via `NEXT_PUBLIC_API_URL`, and all 5 pages (`/tenants`, `/tenants/new`, `/tenants/[id]/edit`, `/preview`, `/diff`) function correctly against the live data with no console errors on the golden path.

## Approach

Deploy from `app/frontend` using the Vercel CLI. Set `NEXT_PUBLIC_API_URL` in Vercel project environment variables. After deploy, update the `CORS_ORIGIN` secret on Fly.io to the live Vercel URL and redeploy the backend. Then run the full smoke test manually in a browser against both live URLs.

## Execution Steps

- [x] Install the Vercel CLI if not already installed: `npm install -g vercel`
- [x] Run `vercel --prod` from `app/frontend` and link to a new project; accept detected Next.js settings
- [x] Add `NEXT_PUBLIC_API_URL = https://mtc-backend.fly.dev` in Vercel project settings → Environment Variables (Production, non-sensitive)
- [x] Redeploy to pick up the env var: `vercel --prod` again
- [x] Note the live Vercel URL and update Fly.io CORS secret: `fly secrets set CORS_ORIGIN="https://challenge-15-multi-tenant-config.vercel.app"`
- [x] Redeploy the backend to apply the updated CORS secret
- [x] Run the full smoke test in a browser against the live Vercel URL (see How to Test)
- [x] Record both live URLs in the fields below

## How to Test

Open the live Vercel URL and walk through each page:

**Page 1 — Tenant List (`/tenants`):**
- [x] Table shows SafeGuard Insurance, HealthFirst, GovHealth; no console errors

**Page 2 — Create Tenant (`/tenants/new`):**
- [x] Fill in a valid config for a 4th tenant (e.g. "Demo Corp") and submit
- [x] Redirected to `/tenants`; new tenant visible in table; no console errors

**Page 3 — Edit Tenant + Version History (`/tenants/[id]/edit`):**
- [x] Open Demo Corp; change company name, save; re-open and click "Version History" → 2 rows
- [x] Roll back to version 1 → success banner → form resets to original name; history shows 3 rows; no console errors

**Page 4 — Preview (`/preview`):**
- [x] SafeGuard INPATIENT 75000 → assessor tier, ~10 business-day SLA, email notifications
- [x] GovHealth INPATIENT 75000 → officer tier, longer SLA, all channels; no console errors

**Page 5 — Diff (`/diff`):**
- [x] SafeGuard vs GovHealth → yellow-highlighted differences; no console errors

**Cleanup:**
- [x] Delete "Demo Corp" from `/tenants` — row disappears

Expected result: All 5 pages load and function against the live backend. A 4th tenant can be created and used immediately. No console errors on the golden path. Both live URLs are publicly accessible.

**Record the live URLs:**
- Frontend: `https://challenge-15-multi-tenant-config.vercel.app`
- Backend: `https://mtc-backend.fly.dev`

## Time

- **In:** 2026-06-20 20:12:00
- **Out:** 2026-06-20 21:30:00
- **Estimate:** 20 min
