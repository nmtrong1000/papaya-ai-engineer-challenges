# MTC-12. Build tenant config form — branding and claim types sections

## Requirement

The pages at `/tenants/new` and `/tenants/[id]/edit` render a multi-section form with working branding and claim types sections; the edit page pre-fills from a `useTenant` hook; the `TenantForm` component is a pure UI component with no direct API calls.

## Approach

Follow the layer-based architecture: `hooks/useTenant.ts` owns the fetch of the existing tenant config for the edit page; `TenantForm` and its section components are pure UI — they receive `defaultValues` via props and manage internal state only through React Hook Form (`useForm` with `zodResolver`). Pages are thin: `/tenants/new` renders the form with empty defaults; `/tenants/[id]/edit` uses the hook to load defaults then renders the form. The `onSubmit` prop is a no-op at this stage — API wiring comes in a later task.

## Execution Steps

- [x] Install React Hook Form and Zod resolver in `app/frontend`: `npm install react-hook-form @hookform/resolvers`
- [x] Create `app/frontend/hooks/useTenant.ts` — `useTenant(id)` that fetches `GET /tenants/:id` on mount and returns `{ config, loading, error }`
- [x] Create `app/frontend/components/TenantForm/index.tsx` — pure UI form wrapper: `useForm<TenantConfig>` with `zodResolver(TenantConfigSchema)` and `defaultValues` prop; renders section components and a submit button that shows "Saving…" when `isSubmitting` is true
- [x] Create `app/frontend/components/TenantForm/BrandingSection.tsx` — 4 labeled inputs (Company Name, Logo URL, Primary Color `type="color"`, Secondary Color); shows inline Zod error messages; no API calls
- [x] Create `app/frontend/components/TenantForm/ClaimTypesSection.tsx` — 5 checkboxes (OUTPATIENT through OPTICAL); checking a type appends via `useFieldArray`, unchecking removes it; each enabled type expands a sub-form with Required Docs (textarea), Optional Docs (textarea), SLA Days, and Escalate To inputs; shows per-field validation errors
- [x] Create `app/frontend/app/tenants/new/page.tsx` — thin `'use client'` component: renders `<TenantForm>` with empty defaults and a no-op `onSubmit`
- [x] Create `app/frontend/app/tenants/[id]/edit/page.tsx` — thin `'use client'` component: uses `useTenant(params.id)`, shows loading/error states, passes `config` as `defaultValues` to `<TenantForm>`

## How to Test

```bash
# Backend running on port 4000 with seeded data
cd challenges/challenge-15-multi-tenant-config/app/frontend
npm run dev
```

Open `http://localhost:3000/tenants/new`:
- Branding inputs and 5 claim type checkboxes render
- Checking INPATIENT expands sub-form with required docs, optional docs, SLA days, escalation
- Clicking Save with empty Company Name shows an inline Zod error; no API call is made

Open `http://localhost:3000/tenants/<safeguard-id>/edit`:
- Page shows loading state briefly then renders form pre-filled with SafeGuard's values
- Branding name "SafeGuard Insurance", primary color #1D4ED8
- OUTPATIENT, INPATIENT, DENTAL checked with their sub-forms pre-filled

Expected result: `TenantForm` and section components contain no `fetch` calls. Data fetching for the edit page is entirely inside `useTenant`. The edit page component is < 15 lines.

## Time

- **In:** 2026-06-20 12:16:13
- **Out:** 2026-06-20 13:13:23
- **Estimate:** 40 min
