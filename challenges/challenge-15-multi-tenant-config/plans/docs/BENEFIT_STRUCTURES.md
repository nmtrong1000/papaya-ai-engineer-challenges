# Benefit Structures

## What It Is

A benefit structure defines *what an insurance policy actually pays for* — which treatments are covered, up to what limits, under what conditions, and whether the policyholder pays a share. It is the financial promise of the policy, translated into a set of rules the claims system enforces.

If the claim workflow is the *process* of handling a claim, the benefit structure is the *rulebook* for how much to pay out.

## Why It Exists

Insurance is a financial product. The insurer collects premiums in exchange for covering defined costs. The benefit structure is the written definition of that exchange — it prevents disputes ("you said you'd cover dental!") and lets the claims system calculate the exact payable amount automatically.

## Core Components

### 1. Coverage Categories (What Is Covered)
The high-level list of claim types the policy covers. In health insurance this typically includes:

| Category | What It Covers |
|----------|---------------|
| Outpatient | Doctor visits, clinic consultations, pharmacy |
| Inpatient | Hospitalization, surgery, ICU |
| Dental | Fillings, extractions, root canals, dentures |
| Maternity | Delivery, pre/post-natal care |
| Optical | Glasses, contact lenses, eye tests |
| Specialist | Referrals to specialists outside a GP visit |
| Emergency | Accident & emergency treatment |

### 2. Benefit Limits (How Much Is Covered)
Each category typically has one or more limits:

| Limit Type | Meaning | Example |
|------------|---------|---------|
| **Annual limit** | Maximum payout in a policy year across all claims | RM 100,000/year total |
| **Per-claim limit** | Maximum payout for a single claim | RM 20,000 per hospitalization |
| **Per-visit limit** | Maximum for a single visit/consultation | RM 200 per GP visit |
| **Sub-limit** | Cap on a specific item within a category | RM 3,000/year for dental within a RM 100k overall policy |

### 3. Deductibles (What the Policyholder Pays First)
The amount the policyholder must pay before the insurer covers anything.

- **Annual deductible:** Pay the first RM 500 of claims each year; insurer covers the rest.
- **Per-claim deductible:** Pay the first RM 200 of every claim.

Deductibles are common in retail/individual policies. Corporate group schemes often have zero deductible as an employee benefit perk.

### 4. Co-Insurance / Co-Payment (Shared Cost)
After the deductible, the policyholder may still share a percentage of each claim.

- **Co-insurance:** Insurer pays 80%, policyholder pays 20%.
- **Co-payment (co-pay):** Fixed flat fee per visit (e.g., RM 30 per GP visit, insurer covers the rest).

### 5. Out-of-Pocket Maximum
The annual cap on how much the policyholder can ever be asked to pay in a single plan year — including deductibles, co-pays, and co-insurance combined. Once this cap is hit, the insurer covers 100% for the rest of the year.

- Example: Out-of-pocket maximum = RM 5,000. Once you've paid RM 5,000 in deductibles + co-pays this year, all remaining claims are fully covered.
- This protects policyholders from catastrophic costs in years with serious illness.
- Common in US plans (legally required under the ACA); present but less standardized in Asian markets.

### 6. Waiting Periods
Some benefits only activate after a waiting period from policy start:
- Maternity: often 10–12 months waiting period
- Pre-existing conditions: 24-month exclusion window
- Dental: 6-month waiting period

### 7. Exclusions
Conditions or treatments the policy explicitly does not cover:
- Cosmetic surgery
- Self-inflicted injuries
- Experimental treatments
- Pre-existing conditions (during waiting period)

## Types of Benefit Structures

| Type | Description | Common For |
|------|-------------|------------|
| **Comprehensive** | Broad coverage, high limits, low deductibles | Corporate group schemes |
| **Basic / Essential** | Covers inpatient only or low limits | Affordable retail products |
| **Tiered** | Different coverage levels (Silver / Gold / Platinum) | Retail consumer products |
| **Defined benefit** | Fixed payout regardless of actual cost (e.g., RM 500/day for hospitalization) | Supplemental/income protection products |
| **Reimbursement** | Covers actual cost up to limits | Most common in health insurance |
| **Panel-based** | Full coverage at network hospitals; partial coverage elsewhere | HMO-style managed care |

## Relationship to This Challenge

**Important note:** Benefit structures (limits, co-pays, deductibles, sub-limits) are *not* in scope for Challenge 15's tenant configuration schema. The challenge focuses on:

- Which claim *types* are enabled (coverage categories — a subset of benefit structure)
- Approval rules (routing, not limit calculation)
- Document requirements
- SLA and notifications

The reason to understand benefit structures is context: in a real product, the approval rules and SLA would sit *inside* a larger benefit structure. The `processClaim()` function in this challenge computes routing and documentation, not the payable amount. If a "benefit limit check" step were added to the workflow, it would query the benefit structure.

## Why Tenants Differ

| Tenant | Key Benefit Differences (Real World) |
|--------|--------------------------------------|
| SafeGuard (Corporate) | High annual limits (employer-funded), zero deductible, no co-pay |
| HealthFirst (Retail) | Moderate limits, annual deductible applies, co-pay on outpatient |
| GovHealth (Government) | Defined benefit (fixed daily room rate), strict exclusion list, no dental/optical |

These real-world differences explain why each tenant in the challenge has different enabled claim types and auto-approval thresholds — they reflect the underlying benefit design even though we're not implementing the full benefit calculation engine.
