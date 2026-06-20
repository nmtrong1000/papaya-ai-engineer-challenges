# MTC-14. Wire tenant form submission and validation to the API

## Requirement

Submitting the tenant config form at `/tenants/new` calls `POST /tenants` and at `/tenants/[id]/edit` calls `PUT /tenants/:id`, with API error messages displayed above the form and a redirect to `/tenants` on success — with all mutation logic in a `useTenantMutations` hook.

## Approach

Follow the layer-based architecture: `hooks/useTenantMutations.ts` owns the POST/PUT API calls, loading state, error state, and redirect on success. Pages remain thin — they call the hook and pass the returned `submit` handler as `onSubmit` to `TenantForm`. `TenantForm` stays a pure UI component: it calls `props.onSubmit(data)` and renders any error it receives via an `error` prop. The `slug` field is editable on create and read-only on edit (slug is immutable after creation).

## Execution Steps

- [ ] Create `app/frontend/hooks/useTenantMutations.ts` — `useCreateTenant()` hook (POST /tenants, loading/error state, `router.push('/tenants')` on success) and `useUpdateTenant(id)` hook (PUT /tenants/:id, same pattern)
- [ ] Add `error?: string | null` prop to `TenantForm/index.tsx` — renders a red banner above the form when set
- [ ] Add `slug` input field to `TenantForm/index.tsx` (above BrandingSection) — editable when `!isEditMode`, read-only display when `isEditMode`; label "Slug", pattern `[a-z0-9-]+`
- [ ] Update `app/frontend/app/tenants/new/page.tsx` — use `useCreateTenant()`, pass `submit`, `isSubmitting`, and `error` to `<TenantForm>`
- [ ] Update `app/frontend/app/tenants/[id]/edit/page.tsx` — use `useUpdateTenant(params.id)` alongside `useTenant(params.id)`; pass both handlers and states to `<TenantForm>`

## How to Test

```bash
# Both backend (port 4000) and frontend (port 3000) running
```

**Create flow:**
1. Open `http://localhost:3000/tenants/new`
2. Fill all required fields — slug, branding, at least one claim type with SLA
3. Click Save → button shows "Saving…" → redirects to `/tenants` → new tenant in table

**Edit flow:**
1. Click Edit on the new tenant, change company name, click Save → redirects with updated name

**Validation — no network call on Zod error:**
1. On `/tenants/new`, clear Company Name, click Save
2. Inline Zod error appears — no request in DevTools Network tab

**API error — duplicate slug:**
1. Try creating with slug `safeguard-insurance` (already exists)
2. Backend returns 400 → red error banner appears above the form

Expected result: `NewTenantPage` and `EditTenantPage` each contain no `fetch` calls. `TenantForm` receives `onSubmit`, `isSubmitting`, and `error` as props; it does not know what API is being called.

## Time

- **In:** _(YYYY-MM-DD HH:mm:ss — filled by agent at start)_
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 30 min
