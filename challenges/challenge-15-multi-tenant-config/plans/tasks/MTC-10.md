# MTC-10. Write unit tests for service and claim logic

## Requirement

The `TenantService` and `ClaimService` business logic is covered by passing unit tests with ≥ 60% line coverage across both service modules.

## Approach

Use Vitest as the test runner and `vi.mock` to stub the Prisma singleton (`src/lib/prisma.ts`) and the config cache (`src/lib/configCache.ts`). Tests live in `src/__tests__/` and target the two service files directly. No HTTP layer is involved — controllers and routes are out of scope here. Run coverage with `npx vitest run --coverage`; the task is complete only when coverage reaches ≥ 60%.

## Testing Strategy

- **Type:** unit
- **Framework:** Vitest + `@vitest/coverage-v8`
- **Coverage target:** ≥ 60% line coverage across `tenantService.ts` and `claimService.ts`
- **What to test:**
  - `ClaimService.processClaim` — auto-approval below threshold, tier matching, SLA date calculation, required/optional doc assembly, notification selection, custom field passthrough
  - `TenantService.getTenantById` — cache hit returns cached value; cache miss calls repository and populates cache; missing tenant throws 404
  - `TenantService.listTenants` — delegates to repository
  - `TenantService.deleteTenant` — calls repository delete and invalidates cache
- **What NOT to test:** Prisma internals, adapter behaviour, HTTP status codes, controller parsing

## Execution Steps

- [ ] Install Vitest and coverage plugin in `app/backend`: `npm install -D vitest @vitest/coverage-v8`
- [ ] Add `"test": "vitest run"` and `"coverage": "vitest run --coverage"` scripts to `app/backend/package.json`
- [ ] Add a `vitest.config.ts` at `app/backend/vitest.config.ts` — point `include` at `src/__tests__/**/*.test.ts`, enable `coverage.reporter = ['text', 'lcov']`, set `coverage.include = ['src/services/**']`
- [ ] Create `app/backend/src/__tests__/claimService.test.ts` — mock `tenantRepository` and `configCache`; write tests for all `processClaim` branches (auto-approve, tier selection, SLA, docs, notifications)
- [ ] Create `app/backend/src/__tests__/tenantService.test.ts` — mock `tenantRepository` and `configCache`; test cache-hit, cache-miss, 404 throw, listTenants, deleteTenant cache invalidation
- [ ] Run `npm run coverage` in `app/backend` and confirm ≥ 60% line coverage reported for both service files

## How to Test

```bash
cd challenges/challenge-15-multi-tenant-config/app/backend
npm run test
# Expected: all tests pass, no failures

npm run coverage
# Expected: coverage table shows ≥ 60% Lines for tenantService.ts and claimService.ts
```

Expected result: All tests green. Coverage threshold met. No TypeScript errors.

## Time

- **In:** 2026-06-20 12:00:32
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 40 min
