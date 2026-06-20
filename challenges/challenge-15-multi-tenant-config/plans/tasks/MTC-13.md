# MTC-13. Build tenant config form — approval rules, notifications, and custom fields

## Requirement

The tenant config form has three additional working sections — approval rules (auto-threshold + dynamic tier list), notifications (per-event configuration), and custom fields (dynamic field list) — all validating with the shared Zod schema and pre-filling correctly on the edit page.

## Approach

Add three section components to the existing `TenantForm`. Approval rules uses `useFieldArray` for the tier list — each tier row has min amount, max amount (nullable), and approver role. Notifications uses `useFieldArray` initialized with all 4 events on first render when no defaults exist — rows are fixed to the 4 notification events, not dynamically added/removed. Custom fields uses `useFieldArray` for fully dynamic rows with a conditional options input that only appears when `fieldType === 'select'`. All sections are composed into `TenantForm/index.tsx` below the existing sections.

## Execution Steps

- [x] Create `app/frontend/components/TenantForm/ApprovalRulesSection.tsx` — number input for `autoApprovalThreshold`; `useFieldArray` for tiers; each row has Min Amount / Max Amount (nullable, empty = no upper bound) / Approver Role / Remove button; "Add Tier" button appends an empty row; shows per-tier validation errors
- [x] Create `app/frontend/components/TenantForm/NotificationsSection.tsx` — `useFieldArray` for notifications; on mount, append all 4 events (claim_submitted, approved, rejected, payment_sent) if `fields.length === 0`; each row shows the event label (read-only), channel checkboxes (email, sms, webhook), and an optional email template input; no add/remove buttons
- [x] Create `app/frontend/components/TenantForm/CustomFieldsSection.tsx` — `useFieldArray` for custom fields; each row has Name / Field Key / Type select (text/number/select) / Required checkbox / Options input (visible only when `fieldType === 'select'`) / Remove button; "Add Field" button appends an empty row with auto-incremented `fieldOrder`
- [x] Add all three sections to `app/frontend/components/TenantForm/index.tsx` in order: Branding → Claim Types → Approval Rules → Notifications → Custom Fields → Save button
- [x] Verify the full form pre-fills correctly on `/tenants/[id]/edit` for all 3 seeded tenants

## How to Test

```bash
cd challenges/challenge-15-multi-tenant-config/app/frontend
npm run dev
```

Open `http://localhost:3000/tenants/new`:
- Approval rules: auto-threshold input shows 0; "Add Tier" adds a row; removing works
- Notifications: 4 rows pre-populated (claim_submitted, approved, rejected, payment_sent) with channel checkboxes
- Custom fields: empty; "Add Field" adds a row; selecting "select" type reveals the options input
- Clicking "Save" with a tier row where approverRole is empty shows a validation error

Open `http://localhost:3000/tenants/<safeguard-id>/edit`:
- Approval rules: threshold 20000; 3 tiers pre-filled (assessor / team_lead / director)
- Notifications: all 4 rows with "email" checked
- Custom fields: 1 row — Employee ID (text, required)

Open `http://localhost:3000/tenants/<govhealth-id>/edit`:
- Approval rules: threshold 0; 4 tier rows (officer / supervisor / director / committee)
- Notifications: all 3 channels checked on each row
- Custom fields: 3 rows (National ID, Department, Employment Type with options)

Expected result: All three sections render and pre-fill correctly for all 3 tenants. Dynamic add/remove works for tiers and custom fields. Notifications initialize with 4 fixed rows. Zod validation errors appear per field on submit.

## Time

- **In:** 2026-06-20 13:13:23
- **Out:** 2026-06-20 13:33:15
- **Estimate:** 45 min
