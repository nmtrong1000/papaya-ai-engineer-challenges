# MTC-18. Write integration tests for all API endpoints

## Requirement

All tenant CRUD, version history, rollback, and process-claim API endpoints are covered by passing integration tests that hit a real test database, with ≥ 60% line coverage across all route and controller modules.

## Approach

Use Vitest + Supertest to spin up the Express `app` in-process (no `listen`) and fire HTTP requests against it. Each test suite uses a dedicated test tenant seeded at the start and cleaned up at the end. The test database is the same Neon instance pointed to by `DATABASE_URL` — tests run against a real Prisma client and real FK constraints. No mocking of Prisma or the HTTP layer. A shared `testHelpers.ts` handles tenant setup and teardown.

## Testing Strategy

- **Type:** integration
- **Framework:** Vitest + Supertest
- **Coverage target:** ≥ 60% line coverage across `src/controllers/` and `src/routes/`
- **What to test:**
  - `GET /tenants` — returns list with branding
  - `POST /tenants` — creates tenant, returns 201; duplicate slug returns 409; invalid body returns 400
  - `GET /tenants/:id` — returns full config; unknown ID returns 404
  - `PUT /tenants/:id` — updates config, creates new version, returns updated tenant
  - `DELETE /tenants/:id` — deletes tenant and all child rows, returns 204
  - `GET /tenants/:id/versions` — returns version list (no config JSON)
  - `POST /tenants/:id/versions/:versionId/rollback` — creates new version from historical snapshot
  - `POST /tenants/:id/process-claim` — returns claim result for valid payload; invalid payload returns 400
- **What NOT to test:** Prisma migration correctness, adapter behaviour, Next.js frontend

## Execution Steps

- [x] Confirm Vitest and Supertest are installed in `app/backend` (`npm install -D supertest @types/supertest` if not already present)
- [x] Create `app/backend/src/__tests__/helpers/testHelpers.ts` — exports `seedTestTenant(slug)` (creates tenant + minimal config via `TenantService`) and `cleanupTestTenant(id)` (calls `TenantRepository.delete`)
- [x] Create `app/backend/src/__tests__/integration/tenants.integration.test.ts` — `beforeAll` seeds one test tenant; tests cover all 5 CRUD routes; `afterAll` cleans up
- [x] Create `app/backend/src/__tests__/integration/versions.integration.test.ts` — seeds tenant, creates a version via PUT, tests list and rollback routes; cleans up
- [x] Create `app/backend/src/__tests__/integration/processClaim.integration.test.ts` — seeds tenant with OUTPATIENT claim type config; POSTs a valid claim and an invalid claim; cleans up
- [x] Run `npm run test` and confirm all integration tests pass
- [x] Run `npm run coverage` and confirm ≥ 60% line coverage across controller and route files

## How to Test

```bash
cd challenges/challenge-15-multi-tenant-config/app/backend
npm run test
# Expected: all integration tests pass

npm run coverage
# Expected: ≥ 60% Lines for src/controllers/ and src/routes/
```

Expected result: All tests green against the live Neon test database. Coverage threshold met. No TypeScript errors.

## Time

- **In:** 2026-06-20 18:16:00
- **Out:** 2026-06-20 18:45:00
- **Estimate:** 50 min
