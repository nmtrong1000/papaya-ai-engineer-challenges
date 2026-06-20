# MTC-11. Build admin shell and tenant list page

## Requirement

The Next.js app has a persistent sidebar layout with navigation links, and `/tenants` renders a table listing all tenants with their name, slug, and action buttons — with data fetching and delete logic isolated in a `useTenantList` hook and the table rendered by a pure `TenantList` component.

## Approach

Follow the layer-based architecture: `hooks/useTenantList.ts` owns all API calls and state (fetch on mount, delete mutation, refetch after delete); `components/TenantList.tsx` is a pure UI component receiving tenants and an `onDelete` callback as props; `app/tenants/page.tsx` is a thin client component that wires the hook to the component. The `apiFetch` wrapper in `lib/api.ts` is the only place that references `NEXT_PUBLIC_API_URL`. All styling uses Tailwind CSS only.

## Execution Steps

- [ ] Set `NEXT_PUBLIC_API_URL=http://localhost:4000` in `app/frontend/.env.local`
- [ ] Create `app/frontend/lib/api.ts` — `apiFetch<T>(path, options?)` that prepends `NEXT_PUBLIC_API_URL`, throws on non-ok responses (attaching status and body to the error), and returns parsed JSON; returns `undefined as T` on 204
- [ ] Create `app/frontend/hooks/useTenantList.ts` — `useTenantList()` with `tenants`, `loading`, `error` state; `fetchTenants` as `useCallback`; `useEffect` on mount; `deleteTenant(id)` that calls DELETE then re-fetches
- [ ] Create `app/frontend/components/TenantList.tsx` — pure UI table with columns Company Name / Slug / Actions; delete calls `window.confirm` then `onDelete(id)`; empty-state row when list is empty; no fetch calls
- [ ] Remove Next.js boilerplate from `app/frontend/app/globals.css` — keep only the Tailwind directives
- [ ] Create `app/frontend/components/Sidebar.tsx` — nav links for `/tenants`, `/preview`, `/diff`; active link highlighted via `usePathname()`; platform name "MTC Admin" at top
- [ ] Update `app/frontend/app/layout.tsx` — two-column layout with `<Sidebar />` on the left and `{children}` in `<main>`
- [ ] Create `app/frontend/app/tenants/page.tsx` — thin `'use client'` component: uses `useTenantList()`, renders header with "New Tenant" link and `<TenantList>` component
- [ ] Create `app/frontend/app/page.tsx` — redirects to `/tenants`

## How to Test

```bash
# Backend running on port 4000 with 3 seeded tenants
cd challenges/challenge-15-multi-tenant-config/app/frontend
npm run dev
```

Open `http://localhost:3000/tenants`:
- Table shows SafeGuard Insurance, HealthFirst, GovHealth
- Sidebar shows navigation links; active link is highlighted
- Delete SafeGuard Insurance → confirm dialog → row disappears
- Run `npm run db:seed` in backend to restore

Expected result: `TenantsPage` contains no `fetch` calls. `TenantList` contains no `fetch` calls. All data logic is in `useTenantList`.

## Time

- **In:** _(YYYY-MM-DD HH:mm:ss — filled by agent at start)_
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 30 min
