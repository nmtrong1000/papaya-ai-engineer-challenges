# MTC-04. Seed the database with 3 sample tenants

## Requirement

Running `npm run db:seed` populates the database with SafeGuard Insurance, HealthFirst, and GovHealth — each with distinct configs across all 6 sections — and the 5 global `ClaimType` rows, all idempotently (safe to re-run).

## Approach

Write `app/backend/prisma/seed.ts`. Open each tenant insert as a Prisma `$transaction`. Start with a full `deleteMany` block in FK-safe order to make the seed idempotent. Upsert the 5 `ClaimType` master rows first. Then insert each tenant with all 6 sections, derive a `VersionConfig` snapshot, insert a `TenantVersion`, and update `Tenant.currentVersionId`. The three tenants are deliberately different to produce distinguishable `processClaim` outputs.

**Tenant specs:**

| | SafeGuard Insurance | HealthFirst | GovHealth |
|--|--|--|--|
| slug | `safeguard-insurance` | `healthfirst` | `govhealth` |
| primaryColor | `#1D4ED8` | `#059669` | `#7C3AED` |
| Claim types | OUTPATIENT, INPATIENT, DENTAL | OUTPATIENT, INPATIENT, DENTAL, MATERNITY | All 5 |
| autoApprovalThreshold | 20 000 | 50 000 | 0 (all manual) |
| Approval tiers | 20k–100k assessor / 100k–500k team_lead / 500k+ director | 50k–200k senior_assessor / 200k–1M manager / 1M+ director | 0–100k officer / 100k–500k supervisor / 500k–2M director / 2M+ committee |
| Notification channels | email | email + sms | email + sms + webhook |
| SLA (OUT / IN / DENTAL / MAT / OPT) | 5 / 10 / 5 / — / — | 7 / 14 / 7 / 21 / — | 15 / 20 / 15 / 25 / 25 |
| Custom fields | Employee ID (text, required) | Employee ID (text, required), Policy Number (text, required) | National ID (text, required), Department (text, required), Employment Type (select: full-time/part-time/contract, required) |

## Execution Steps

- [ ] Create `app/backend/prisma/seed.ts`
- [ ] Add `"prisma": { "seed": "ts-node --transpile-only prisma/seed.ts" }` to `app/backend/package.json` and add `"db:seed": "npx prisma db seed"` to scripts
- [ ] Install `ts-node` as a dev dependency in `app/backend` if not already present
- [ ] Write the seed file — deleteMany all tables in FK-safe order (TenantVersion → CustomField → TenantNotification → ApprovalTier → TenantClaimType → Branding → Tenant → ClaimType), then upsert 5 ClaimType rows
- [ ] For each of the 3 tenants run a `$transaction`: create Tenant, Branding, TenantClaimType rows (look up ClaimType id by name), ApprovalTier rows (with tierOrder), TenantNotification rows (all 4 events), CustomField rows (with fieldOrder), then create TenantVersion with the VersionConfig snapshot and update `Tenant.currentVersionId`
- [ ] Run `npm run db:seed` and verify row counts in `npx prisma studio`
- [ ] Run `npm run db:seed` a second time and verify row counts are unchanged (idempotency check)

## How to Test

```bash
cd challenges/challenge-15-multi-tenant-config/app/backend
npm run db:seed
# Expected output: "Seeded: SafeGuard Insurance, HealthFirst, GovHealth"

npx prisma studio
# Verify row counts:
# Tenant: 3, Branding: 3, ClaimType: 5, TenantClaimType: 12 (3+4+5)
# ApprovalTier: 10 (3+3+4), TenantNotification: 12 (4+4+4)
# CustomField: 6 (1+2+3), TenantVersion: 3
```

Run the seed a second time — row counts must remain the same (idempotency check).

Expected result: All row counts match the table above. Each `Tenant.currentVersionId` points to its corresponding `TenantVersion` row. No FK constraint errors.

## Time

- **In:** _(YYYY-MM-DD HH:mm:ss — filled by agent at start)_
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 30 min
