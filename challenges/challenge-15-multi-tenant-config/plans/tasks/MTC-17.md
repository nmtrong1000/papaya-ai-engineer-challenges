# MTC-17. Build config history and rollback UI

## Requirement

The tenant edit page has a "Version History" tab that lists all saved versions and allows rolling back to any prior version — with all fetching and mutation in `useVersionHistory` and all rendering in a pure `VersionHistory` component.

## Approach

Follow the layer-based architecture: `hooks/useVersionHistory.ts` owns `GET /tenants/:id/versions` and `POST /tenants/:id/rollback/:version`, re-fetches the list after rollback, and returns the new version number. `components/VersionHistory.tsx` is a pure UI component that receives the version list and an `onRollback` callback as props — it shows the table and confirmation prompt but has no API awareness. `app/tenants/[id]/edit/page.tsx` gains a tab UI: "Edit Config" renders `<TenantForm>`; "Version History" renders `<VersionHistory>`. After rollback, a `configKey` counter increments to trigger `useTenant` re-fetch, which causes the form to reset to the rolled-back config.

## Execution Steps

- [x] Create `app/frontend/hooks/useVersionHistory.ts` — `useVersionHistory(tenantId)` that fetches `GET /tenants/:id/versions` on mount; exposes `rollback(version)` that calls `POST /tenants/:id/rollback/:version`, re-fetches the list, and returns the new version number; returns `{ versions, loading, error, rollback }`
- [x] Create `app/frontend/components/VersionHistory.tsx` — pure UI table (Version # / Created At / Note / Action); "Roll back" button disabled for the row with the highest version number (current version); version cell and Roll back button both open a review modal with `TenantForm readOnly`; confirm button triggers rollback; show a dismissible green success banner "Rolled back to version N. New version M created."; format `createdAt` as a readable locale string
- [x] Add `tab` state (`'edit' | 'history'`, default `'edit'`) to `app/frontend/app/tenants/[id]/edit/page.tsx` with two tab buttons
- [x] Compose both tabs in the edit page using `useVersionHistory(params.id)` and the existing `useTenant` + `useUpdateTenant` hooks; on rollback success, increment `configKey` to trigger `useTenant` re-fetch; pass updated config to `TenantForm` via `defaultValues`

## How to Test

```bash
# Both backend (port 4000) and frontend (port 3000) running
```

Open `http://localhost:3000/tenants/<safeguard-id>/edit`:

**Test 1 — initial history:**
- Click "Version History" tab → 1 row; its "Roll back" button is disabled (it's the current version)

**Test 2 — multiple saves:**
1. "Edit Config" → change name to "SafeGuard v2", save → redirects to list
2. Re-open edit → change to "SafeGuard v3", save again
3. "Version History" → 3 rows; version 3 has disabled rollback; versions 1 and 2 have active buttons

**Test 3 — rollback:**
1. Click "Roll back" on version 1, confirm
2. Green banner: "Rolled back to version 1. New version 4 created."
3. History shows 4 rows; version 4 is now disabled
4. Switch to "Edit Config" → Company Name shows "SafeGuard Insurance" (original v1 value)

Expected result: `EditTenantPage` orchestrates the two hooks but makes no direct fetch calls. `VersionHistory` has no API knowledge — it calls `onRollback` and receives the new version number via `onRollbackSuccess`. Version count only ever grows; no rows are deleted or mutated.

## Time

- **In:** 2026-06-20 17:11:00
- **Out:** 2026-06-20 18:15:00
- **Estimate:** 35 min
