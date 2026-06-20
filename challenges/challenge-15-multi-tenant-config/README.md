# Challenge 15 — Multi-Tenant Configuration Platform

## What Was Built

A full-stack admin platform for managing per-tenant insurance claim configurations. Operations teams can onboard new insurers by filling out a configuration form with zero code changes.

**Features:**
- **Tenant CRUD** — create, list, edit, and delete tenant configurations across 6 config sections: branding, claim types, approval rules, notifications, SLA, and custom fields
- **Claim Preview** — select a tenant + enter a sample claim to see the full processing outcome (approval tier, required documents, SLA deadline, notifications, custom fields)
- **Config Diff** — side-by-side comparison of any two tenant configs with difference highlighting
- **Version History** — every save creates a version; view past versions and rollback to any point
- **Runtime processing** — `processClaim(tenantId, claimData)` returns approval routing, required documents, SLA deadline, notification triggers, and custom field validation

3 sample tenants are seeded (SafeGuard, HealthFirst, GovHealth) each producing different outcomes for identical claims. A 4th tenant created through the UI works immediately.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4, React Hook Form, Zod v4 |
| Backend | Node.js, Express, Prisma ORM, PostgreSQL |
| Frontend hosting | Vercel |
| Backend hosting | Fly.io |
| Database | Fly.io Postgres |

## Live URL

**Admin UI:** https://challenge-15-multi-tenant-config.vercel.app

**Backend API:** https://mtc-backend.fly.dev

## How to Run Locally

**Backend:**
```bash
cd app/backend
npm install
# Create .env with DATABASE_URL and CORS_ORIGIN=http://localhost:3000
npx prisma migrate dev
npm run db:seed   # seeds 3 sample tenants
npm run dev       # http://localhost:4000
```

**Frontend:**
```bash
cd app/frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev       # http://localhost:3000
```

**Sync schemas after changes:**
```bash
cp -r app/backend/src/lib/shared/ app/frontend/lib/shared/
```

## Approach & Trade-offs

**Shared schemas without a shared package** — Zod schemas are authored once in `backend/src/lib/shared/` and copied to `frontend/lib/shared/` when they change. This avoids npm workspace complexity and lets each app deploy independently (Vercel doesn't need backend source; Fly.io doesn't need frontend source).

**Version history as append-only log** — every save writes a new `TenantVersion` row with the full config snapshot. Rollback creates a new version rather than mutating history, so the audit trail is always complete.

**Config diff at query time** — the diff page fetches both tenant configs client-side and computes differences in the browser. No diff stored in the database — this keeps the backend simple and avoids stale diffs.

**Approval tiers are open ranges** — `maxAmount: null` means "no upper limit", allowing a catch-all top tier without a magic number.

**Not implemented:** real authentication/authorisation (any user can edit any tenant), email/SMS/webhook delivery (notifications are configured but not dispatched), and currency localisation.
