# MTC-09. Implement processClaim function and API endpoint

## Requirement

`POST /tenants/:id/process-claim` accepts a claim (type, amount, submissionDate) and returns the correct required documents, optional documents, approval tier, auto-approval flag, notification list, SLA due date, and custom fields for that tenant — matching the OpenAPI spec.

## Approach

`ClaimService` contains the pure `processClaim(config, claimData)` function — no Prisma, no HTTP. The service receives a fully assembled `TenantConfig` (loaded by `TenantService.getTenantById` from cache or DB) and returns a `ProcessClaimResult`. `ClaimController` handles the HTTP layer: parse the request, delegate config loading to `TenantService`, delegate processing to `ClaimService`, send the response. No repository is needed — no DB write occurs during claim processing.

**Processing logic:**
- `requiredDocs`/`optionalDocs` — from the matched `claimTypes` entry; throw 400 if claim type is not enabled
- `autoApproved` — `amount < autoApprovalThreshold`
- `approvalTier` — if `autoApproved`, null; else find the tier where `minAmount ≤ amount` and (`maxAmount === null` or `amount < maxAmount`)
- `notifications` — all `config.notifications` entries
- `slaDueDate` — `submissionDate` + `slaDays` business days for the matched claim type
- `customFields` — all `config.customFields`

## Execution Steps

- [ ] Create `app/backend/src/lib/businessDays.ts` — `addBusinessDays(date, days)` that increments the date one day at a time, skipping Saturdays (day 6) and Sundays (day 0)
- [ ] Create `app/backend/src/services/claimService.ts` — pure `processClaim(config, data)` function with no Prisma imports; throws `{ status: 400 }` if claim type not enabled; returns the full `ProcessClaimResult`
- [ ] Create `app/backend/src/controllers/claimController.ts` — parse body with `ClaimDataSchema` (return 400 on failure), load tenant via `TenantService.getTenantById`, call `ClaimService.processClaim`, return result as JSON; wrap in try/catch → next(err)
- [ ] Create `app/backend/src/routes/processClaim.ts` — Router with `mergeParams: true`; POST /:id/process-claim
- [ ] Mount the process-claim router in `app.ts`: `app.use('/tenants', processClaimRouter)`
- [ ] Smoke test against all 3 seeded tenants to verify different approvalTier, slaDueDate, and notifications per claim

## How to Test

```bash
cd challenges/challenge-15-multi-tenant-config/app/backend
npm run dev

# 15,000 — below SafeGuard threshold (20,000), auto-approved
curl -X POST http://localhost:4000/tenants/<safeguard-id>/process-claim \
  -H "Content-Type: application/json" \
  -d '{"claimType":"INPATIENT","amount":15000,"submissionDate":"2026-06-20"}'
# Expected: autoApproved: true, approvalTier: null

# 75,000 — different tiers per tenant
# SafeGuard: assessor (20k–100k)
# HealthFirst: senior_assessor (50k–200k)
# GovHealth: officer (0–100k)

# Disabled claim type
curl -X POST http://localhost:4000/tenants/<safeguard-id>/process-claim \
  -H "Content-Type: application/json" \
  -d '{"claimType":"MATERNITY","amount":50000,"submissionDate":"2026-06-20"}'
# Expected: 400

# SLA check: SafeGuard INPATIENT has 10 slaDays
# 2026-06-20 (Sat) + 10 business days = 2026-07-04 (Sat)? Adjust for weekends.
```

Expected result: The 3 seeded tenants produce different `approvalTier`, `slaDueDate`, and notification `channels` for the same claim input. `ClaimService.processClaim` is a pure function with no Prisma imports. `ClaimController` contains no business logic.

## Time

- **In:** 2026-06-20 11:53:34
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 30 min
