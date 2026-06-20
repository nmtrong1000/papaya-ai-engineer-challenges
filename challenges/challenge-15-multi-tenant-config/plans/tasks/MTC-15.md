# MTC-15. Build preview mode

## Requirement

The page at `/preview` lets a user select a tenant and enter a claim, then displays the `processClaim` result — with all API calls in `useProcessClaim` and all result rendering in a pure `ClaimResult` component.

## Approach

Follow the layer-based architecture: `hooks/useProcessClaim.ts` owns the POST call, loading state, and error state; it clears the previous result on each new submission. `components/ClaimResult.tsx` is a pure UI component that receives a `ProcessClaimResult` as a prop and renders it in labelled sections. `app/preview/page.tsx` is thin: it wires `useTenantList` (for the dropdown), `useProcessClaim`, and a local claim form, then renders `<ClaimResult>` when a result is available.

## Execution Steps

- [ ] Create `app/frontend/hooks/useProcessClaim.ts` — `useProcessClaim()` with `result`, `loading`, `error` state and a `submit(tenantId, claimData)` function that clears state, calls `POST /tenants/:id/process-claim`, and sets result or error
- [ ] Create `app/frontend/components/ClaimResult.tsx` — pure UI component receiving `ProcessClaimResult` as a prop; renders sections: Required Documents (`<ul>`), Optional Documents (`<ul>`), Approval (green "Auto-approved" badge or tier amount range + approver role), Notifications (table: Event / Channels / Template), SLA Due Date, Custom Fields (table or "None"); no fetch calls
- [ ] Create `app/frontend/app/preview/page.tsx` — thin `'use client'` component: uses `useTenantList()` for tenant dropdown, `useProcessClaim()` for submission; renders a claim form (claimType select with 5 options, amount number input, submissionDate date input defaulting to today) and `<ClaimResult>` when result is available; shows loading spinner or error message
- [ ] Add "Preview" link to `app/frontend/components/Sidebar.tsx`

## How to Test

```bash
# Both backend (port 4000) and frontend (port 3000) running
```

Open `http://localhost:3000/preview`:

**Test 1 — auto-approval:**
- Select SafeGuard Insurance, OUTPATIENT, amount 10000, today
- Expected: green "Auto-approved" badge (10000 < 20000 threshold)

**Test 2 — different tiers for same claim across tenants (INPATIENT, 75000):**
- SafeGuard: assessor (20k–100k), 10 SLA days, email only
- HealthFirst: senior_assessor (50k–200k), 14 SLA days, email + sms
- GovHealth: officer (0–100k), 20 SLA days, all channels

**Test 3 — disabled claim type:**
- Select SafeGuard Insurance, MATERNITY, any amount
- Expected: red error "Claim type MATERNITY not enabled for this tenant"

Expected result: `PreviewPage` contains no `fetch` calls. `ClaimResult` receives a plain object prop and renders it — no hooks or API calls inside it. Switching tenants and resubmitting shows updated results.

## Time

- **In:** 2026-06-20 14:08:55
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 40 min
