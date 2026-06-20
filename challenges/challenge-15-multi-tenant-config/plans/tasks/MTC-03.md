# MTC-03. Define Prisma schema and connect to Neon PostgreSQL

## Requirement

All 8 database tables exist in Neon PostgreSQL, created via a Prisma migration, and Prisma Client is generated and importable in `app/backend`.

## Approach

Prisma lives in `app/backend`. The schema defines all 8 models matching the ERD: `Tenant`, `Branding`, `ClaimType`, `TenantClaimType`, `TenantNotification`, `ApprovalTier`, `CustomField`, `TenantVersion`. All string IDs use `@default(cuid())`. PostgreSQL `text[]` arrays map to `String[]` in Prisma schema. `Tenant.currentVersionId` is a nullable self-relation FK to `TenantVersion` using a named relation (`"CurrentVersion"`) to distinguish it from the `"AllVersions"` back-relation. Set `DATABASE_URL` in `app/backend/.env` pointing to the Neon connection string.

## Execution Steps

- [ ] Install Prisma and Prisma Client in `app/backend`: `npm install @prisma/client` and `npm install -D prisma`, then run `npx prisma init`
- [ ] Set `DATABASE_URL` in `app/backend/.env` to the Neon PostgreSQL connection string (from Neon dashboard → Connection string) and add `.env` to `.gitignore`
- [ ] Write `app/backend/prisma/schema.prisma` with all 8 models — Tenant (with nullable `currentVersionId` self-relation), Branding (1:1 with Tenant), ClaimType (global lookup), TenantClaimType (with `String[]` for docs arrays), TenantNotification, ApprovalTier, CustomField, TenantVersion (with `Json` config and named back-relation to Tenant)
- [ ] Run `npx prisma migrate dev --name init` from `app/backend`
- [ ] Run `npx prisma generate` to generate Prisma Client
- [ ] Verify all 8 tables appear in `npx prisma studio` with the correct columns

## How to Test

```bash
cd challenges/challenge-15-multi-tenant-config/app/backend
npx prisma migrate dev --name init
# Expected: "Your database is now in sync with your schema"

npx prisma studio
# Open http://localhost:5555
# Verify 8 tables: Tenant, Branding, ClaimType, TenantClaimType,
# TenantNotification, ApprovalTier, CustomField, TenantVersion
# All tables empty, all columns present
```

Expected result: Migration completes without errors. All 8 tables visible in Prisma Studio with the correct columns.

## Time

- **In:** 2026-06-20 10:25:56
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 30 min
