# MTC-05. Define shared Zod schemas and TypeScript types

## Requirement

`app/shared/src/index.ts` exports validated Zod schemas and inferred TypeScript types for the full tenant config, version snapshot, claim input, and claim processing result — importable from both `app/backend` and `app/frontend` via `@mtc/shared`.

## Approach

All schemas live in `app/shared/src/schemas/`. Types are inferred with `z.infer<>` — no separate type declarations needed. Field names match the Prisma schema (camelCase). `TenantConfigSchema` is the create/update request body (what the frontend sends; what the backend validates). `VersionConfigSchema` is the snapshot shape written to `TenantVersion.config` — it adds `schemaVersion: z.number()` to distinguish future migrations. `ClaimDataSchema` uses `z.coerce.date()` for `submissionDate` so an ISO string from JSON parses into a `Date`. Install Zod in `app/shared` and re-export from the barrel so consumers only need one dependency.

## Execution Steps

- [ ] Install Zod in `app/shared`: `npm install zod` from `app/shared`
- [ ] Create `app/shared/src/schemas/tenant.ts` — BrandingSchema, ClaimTypeEnum (OUTPATIENT|INPATIENT|DENTAL|MATERNITY|OPTICAL), ClaimTypeConfigSchema, ApprovalTierSchema (maxAmount nullable), NotificationEventEnum, NotificationChannelEnum, NotificationSchema, CustomFieldTypeEnum, CustomFieldSchema, TenantConfigSchema
- [ ] Create `app/shared/src/schemas/version.ts` — VersionConfigSchema (schemaVersion: z.number() + all 6 config sections reusing sub-schemas from tenant.ts)
- [ ] Create `app/shared/src/schemas/claim.ts` — ClaimDataSchema (claimType, amount, submissionDate as z.coerce.date()) and ProcessClaimResultSchema (requiredDocs, optionalDocs, autoApproved, approvalTier nullable, notifications, slaDueDate, customFields)
- [ ] Update `app/shared/src/index.ts` — re-export all schemas and infer and export TypeScript types: `TenantConfig`, `VersionConfig`, `ClaimData`, `ProcessClaimResult`
- [ ] Verify TypeScript compiles clean in both `app/backend` and `app/frontend`: `npx tsc --noEmit` in each

## How to Test

```bash
cd challenges/challenge-15-multi-tenant-config/app/backend
npx tsc --noEmit
# Expected: no errors

cd ../frontend
npx tsc --noEmit
# Expected: no errors
```

Add a temporary smoke-test import in `app/backend/src/index.ts`:
```ts
import { TenantConfigSchema } from '@mtc/shared'
console.log(TenantConfigSchema.safeParse({}).success) // false — expected
```
```bash
cd app/backend && npm run dev
# Expected: prints "false" without throwing; no module resolution errors
```

Expected result: Both packages compile clean. `@mtc/shared` import resolves. `TenantConfigSchema.safeParse` runs without throwing.

## Time

- **In:** 2026-06-20 10:59:30
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 25 min
