# MTC-21. Responsive design and UX improvements

## Requirement

All 5 pages are fully usable at 375px and 768px. The tenant edit/create experience has a back button, a delete button (edit only), and proper loading/error feedback. The tenant list shows a per-row loading state during delete so users know their action registered.

## Approach

Responsive work: collapsible sidebar on mobile, horizontal-scroll tables, single-column form grids below `sm:`. UX work: add "← Back" button to the edit and new-tenant page headers; add a "Delete" button next to Save on the edit page (calls delete + redirects); expose loading/error from `useTenantMutations` up to the page and render a submit spinner + error banner; track which tenant ID is being deleted in `useTenantList` and show a per-row spinner in `TenantList`.

## Execution Steps

- [x] Make the root layout responsive — hamburger top bar on mobile, fixed overlay sidebar, always-visible on `md+`
- [x] Fix `/tenants` table — `overflow-x-auto` wrapper
- [x] Fix form grids — `grid-cols-1 sm:grid-cols-N` on ApprovalRules, CustomFields, diff dropdowns, preview fields, ClaimResult
- [x] Fix `/diff` DiffTable — `overflow-x-auto` wrapper
- [x] Fix VersionHistory table — `overflow-x-auto` wrapper
- [x] Add "← Back" button to `/tenants/new` and `/tenants/[id]/edit` page headers
- [x] Add "Delete" button next to Save on `/tenants/[id]/edit`; `useDeleteTenant` hook calls DELETE then redirects to `/tenants`
- [x] `isSubmitting` (RHF) drives Save spinner; `error` prop shows red banner; `deleting` prop disables both buttons while delete is in progress
- [x] Track `deletingId` in `useTenantList`; pass to `TenantList`; show "Deleting…" in that row; disable other delete buttons
- [x] Smoke test responsive layout at 375px, 768px, 1280px

## How to Test

**Responsive (375px):**
- Sidebar hidden; hamburger opens overlay; backdrop closes it
- Tables scroll horizontally; form fields stack

**UX — Back button:**
- `/tenants/new` and `/tenants/[id]/edit` both show "← Back" in the header; clicking navigates to `/tenants`

**UX — Delete on edit page:**
- Open any tenant edit page; "Delete" button visible next to "Save"
- Click Delete → tenant removed → redirected to `/tenants` → tenant gone from list

**UX — Save loading/error:**
- Block the PUT request in DevTools Network → click Save → button shows "Saving…", disabled → error banner appears above submit area
- Unblock → save works → redirects normally

**UX — Table delete loading:**
- Click Delete on a tenant row → that row immediately shows "Deleting…" spinner; other rows still active
- After delete completes → row disappears

## Time

- **In:** 2026-06-20 21:40:00
- **Out:** 2026-06-20 23:15:00
- **Estimate:** 60 min
