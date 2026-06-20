# MTC-07. Build Express server with tenant CRUD API

## Requirement

All 5 tenant CRUD endpoints (`GET /tenants`, `POST /tenants`, `GET /tenants/:id`, `PUT /tenants/:id`, `DELETE /tenants/:id`) are implemented across three layers — Repository, Service, Controller — with the full 8-step transactional save flow on create and update, returning shapes that match the OpenAPI spec.

## Approach

Follow the three-layer architecture: **Repository** wraps all Prisma calls; **Service** orchestrates business logic; **Controller** handles HTTP parsing and response; **Route** contains path definitions only.

`TenantService.saveTenantConfig` runs one Prisma `$transaction` with 8 steps: (a) upsert `Branding`, (b) update `Tenant.autoApprovalThreshold`, (c) delete+reinsert `ApprovalTier`, (d) delete+reinsert `TenantClaimType`, (e) delete+reinsert `TenantNotification`, (f) delete+reinsert `CustomField`, (g) insert `TenantVersion` with full config snapshot, (h) update `Tenant.currentVersionId`. Repository methods accept an optional Prisma transaction client; the service orchestrates them.

## Execution Steps

- [ ] Create `app/backend/src/lib/prisma.ts` — singleton `PrismaClient` export
- [ ] Create `app/backend/src/lib/configCache.ts` — in-memory `Map<string, TenantConfig>` with `get`, `set`, and `invalidate` methods keyed by tenant ID
- [ ] Create `app/backend/src/repositories/tenantRepository.ts` — all Prisma methods: `findAll` (with branding), `findById` (with all 5 live-table relations), `create`, `delete`, `updateCurrentVersionId`, `updateAutoApprovalThreshold`, `upsertBranding`, `replaceApprovalTiers`, `replaceTenantClaimTypes` (looks up ClaimType id by name), `replaceNotifications`, `replaceCustomFields`, `getNextVersionNumber` (via aggregate MAX), `createVersion` — transactional methods accept a Prisma `tx` client
- [ ] Create `app/backend/src/services/tenantService.ts` — `buildSnapshot()`, `saveTenantConfig()` (8-step `$transaction` + cache invalidation), `loadTenantConfig()`, `listTenants()`, `getTenantById()` (cache-first, throws 404 if not found), `createTenant()`, `updateTenant()`, `deleteTenant()`
- [ ] Create `app/backend/src/controllers/tenantController.ts` — `list`, `getById`, `create` (parse body with `TenantConfigSchema`, return 400 on failure), `update`, `remove`; each wrapped in try/catch forwarding to `next(err)`
- [ ] Create `app/backend/src/routes/tenants.ts` — Router with GET /, POST /, GET /:id, PUT /:id, DELETE /:id mapped to controller methods
- [ ] Add a global error handler middleware to `app/backend/src/app.ts` — sends `err.status ?? 500` and `err.message`
- [ ] Mount the tenants router in `app.ts`: `app.use('/tenants', tenantsRouter)`
- [ ] Smoke test all 5 CRUD endpoints with curl against the seeded data

## How to Test

```bash
cd challenges/challenge-15-multi-tenant-config/app/backend
npm run dev

curl http://localhost:4000/tenants
# Expected: 3 seeded tenants

curl http://localhost:4000/tenants/<safeguard-id>
# Expected: full config with branding, claimTypes, approvalTiers, etc.

curl -X POST http://localhost:4000/tenants \
  -H "Content-Type: application/json" \
  -d '{"slug":"test-co","branding":{"name":"Test Co","logoUrl":"","primaryColor":"#000000","secondaryColor":"#ffffff"},"autoApprovalThreshold":0,"approvalTiers":[],"claimTypes":[{"type":"OUTPATIENT","requiredDocs":["receipt"],"optionalDocs":[],"slaDays":5,"escalateTo":"manager"}],"notifications":[],"customFields":[]}'
# Expected: 201 with created tenant

curl -X DELETE http://localhost:4000/tenants/<new-id>
# Expected: 204
```

Verify in Prisma Studio that after create/update a `TenantVersion` row exists and `Tenant.currentVersionId` points to it.

Expected result: All 5 routes respond with correct status codes and shapes. `tenantRepository` contains no business logic; `tenantService` contains no HTTP code; `tenantController` contains no Prisma calls.

## Time

- **In:** _(YYYY-MM-DD HH:mm:ss — filled by agent at start)_
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 45 min
