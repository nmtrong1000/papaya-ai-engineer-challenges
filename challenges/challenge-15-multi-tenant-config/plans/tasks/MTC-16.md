# MTC-16. Build config diff view

## Requirement

The page at `/diff` lets a user select two tenants and renders a side-by-side comparison of their current configs with differing fields highlighted — with all fetching in a `useDiff` hook and all rendering in a pure `DiffTable` component.

## Approach

Follow the layer-based architecture: `hooks/useDiff.ts` owns the parallel fetch of both tenant configs using `Promise.all`, exposing them only when both IDs are set and different. `components/DiffRow.tsx` is a pure UI row with a yellow highlight when its two values differ. `components/DiffTable.tsx` is a pure UI table that receives two `TenantConfig` objects and two tenant names and renders one `DiffRow` per field, grouped into sections. `app/diff/page.tsx` is thin: it uses `useTenantList()` for the dropdown options and `useDiff(idA, idB)` for the configs.

## Execution Steps

- [x] Create `app/frontend/hooks/useDiff.ts` — `useDiff(idA, idB)` that fetches both tenant configs in parallel via `Promise.all` when both IDs are set and different; resets configs to null when either ID is null or they are equal; returns `{ configA, configB, loading, error }`
- [x] Create `app/frontend/components/DiffRow.tsx` — pure UI `<tr>` with label / valueA / valueB cells; applies `bg-yellow-100` when `valueA !== valueB`
- [x] Create `app/frontend/components/DiffTable.tsx` — pure UI table accepting `configA`, `configB`, `nameA`, `nameB`; renders a `<DiffRow>` per field grouped into sections: Branding (name, logoUrl, primaryColor, secondaryColor), Approval Rules (threshold, tier count, tier list), Claim Types (one row per platform type: "Enabled (N days)" or "Disabled"), Notifications (one row per event: channels joined), Custom Fields (field count and names)
- [x] Create `app/frontend/app/diff/page.tsx` — thin `'use client'` component: uses `useTenantList()` for two dropdown selects, passes selected IDs to `useDiff`, shows a placeholder when IDs are not set or equal, renders `<DiffTable>` when both configs are loaded
- [x] Add "Diff" link to `app/frontend/components/Sidebar.tsx`

## How to Test

```bash
# Both backend (port 4000) and frontend (port 3000) running
```

Open `http://localhost:3000/diff`:

**Test 1 — same tenant:**
- Select SafeGuard Insurance in both dropdowns
- Expected: placeholder "Select two different tenants to compare"

**Test 2 — SafeGuard vs GovHealth:**
- Many yellow rows: branding colors, autoApprovalThreshold (20000 vs 0), tier counts, MATERNITY/OPTICAL (disabled vs enabled), SLA days, notification channels (email vs all three), custom field counts

**Test 3 — switching tenants:**
- Change Tenant B to HealthFirst — table rerenders with updated differences

Expected result: `DiffPage` contains no `fetch` calls. `DiffTable` and `DiffRow` are pure UI — they receive data as props. `useDiff` fires exactly one parallel `Promise.all` when both IDs change.

## Time

- **In:** 2026-06-20 16:43:00
- **Out:** 2026-06-20 17:10:00
- **Estimate:** 40 min
