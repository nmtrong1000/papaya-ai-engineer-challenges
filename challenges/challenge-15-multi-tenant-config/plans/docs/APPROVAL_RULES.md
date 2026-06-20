# Approval Rules

## What It Is

Approval rules define *who must authorize a claim before payment is released*, based on the claim's amount, type, or risk level. They are the insurer's internal governance layer — a set of checks that ensure high-value or unusual claims get the right level of human scrutiny before money leaves the insurer's account.

In short: a RM 150 GP receipt can go straight through; a RM 450,000 surgery claim needs a director's signature.

> **Industry term:** The formal name for this concept is **underwriting authority** — the defined limit within which a role can approve a claim or risk without needing sign-off from a higher authority. "Approval rules" in this challenge's context is the operationalized, claims-specific version of underwriting authority.

## Why It Exists

- **Financial control:** Prevent large unauthorized payouts. A single fraudulent inpatient claim could cost hundreds of thousands — requiring senior approval adds a human checkpoint.
- **Regulatory compliance:** Many insurance regulators require documented evidence that claims above certain thresholds were reviewed by a qualified person.
- **Risk management:** Higher amounts carry higher risk of fraud, billing error, or policy misinterpretation — more eyes reduce that risk.
- **Separation of duties:** The person who assesses a claim should not also be the person who approves payment. Tiered approval enforces this separation.

## Core Concepts

### Auto-Approval Threshold
The claim amount below which no human review is needed — the system approves and routes to payment automatically.

- Low threshold (e.g., RM 5,000): Many claims go straight through; fast but higher fraud risk.
- High threshold (e.g., RM 20,000): Most routine claims still go through an assessor; slower but more controlled.
- Zero threshold: Every single claim, regardless of amount, requires manual review. Used by government entities and highly regulated schemes.

### Approval Tiers
A set of amount bands, each mapped to a required approver role. Once a claim's amount falls into a band, *that role* must sign off before payment proceeds.

**Example — 3-tier structure (SafeGuard Insurance):**

| Amount Range | Required Approver Role |
|-------------|------------------------|
| < RM 20,000 | Auto-approve (no human) |
| RM 20,000 – RM 100,000 | Assessor |
| RM 100,000 – RM 500,000 | Team Lead |
| > RM 500,000 | Director |

**Example — 2-tier structure (HealthFirst):**

| Amount Range | Required Approver Role |
|-------------|------------------------|
| < RM 5,000 | Auto-approve |
| RM 5,000 – RM 200,000 | Assessor |
| > RM 200,000 | Manager |

**Example — Single-tier, all-manual (GovHealth):**

| Amount Range | Required Approver Role |
|-------------|------------------------|
| Any amount | Committee |

### Approver Roles
Common roles in insurance claim approval chains:

| Role | Typical Responsibility |
|------|------------------------|
| **Assessor** | Front-line reviewer. Checks documents, validates policy coverage, makes initial approve/reject decision. |
| **Team Lead / Senior Assessor** | Reviews assessor's recommendation for mid-range claims. May override assessor decision. |
| **Manager** | Approves higher-value claims. Accountable for team's claims decisions. |
| **Director** | Final authority on the largest or most complex claims. Often involved when legal risk exists. |
| **Committee** | Panel of multiple roles that must reach consensus. Common in government and reinsurance contexts. |
| **Medical Officer** | A doctor employed by the insurer who reviews clinical appropriateness of treatment. |

## Types of Approval Rules

### 1. Amount-Based (Most Common)
As shown above — the higher the amount, the higher the authority required. Simple to implement and audit.

### 2. Claim-Type-Based
Certain claim types always require senior review regardless of amount:
- All maternity claims → require a Medical Officer sign-off
- All inpatient claims > 3 days → require Team Lead review even if amount is low

### 3. Risk-Score-Based
Automated fraud/risk scoring systems flag suspicious claims for mandatory human review. Not amount-driven — a RM 1,000 claim can be flagged if it matches fraud patterns.

### 4. Exception-Based
The first claim on a new policy, claims submitted within 90 days of policy start, or claims near a benefit limit threshold trigger mandatory review.

### 5. Combination Rules
Real-world insurers often combine: "auto-approve if amount < 5,000 AND claim type is outpatient AND policy is active > 12 months AND no prior fraud flags."

## How This Differs Between Tenants

| Dimension | SafeGuard (Corporate) | HealthFirst (Retail) | GovHealth (Government) |
|-----------|-----------------------|----------------------|------------------------|
| Auto-approval threshold | RM 20,000 | RM 5,000 | RM 0 (none) |
| Number of tiers | 3 (assessor, team lead, director) | 2 (assessor, manager) | 1 (committee) |
| Highest authority | Director | Manager | Committee |
| Rationale | Large corporate claims; board accountability | Retail product; simpler governance | Government mandate; all claims need committee sign-off |

## What "Tenant-Configurable" Means in This Challenge

The tenant config stores approval rules as a threshold + an ordered list of tiers:

```json
{
  "autoApprovalThreshold": 20000,
  "tiers": [
    { "minAmount": 20000, "maxAmount": 100000, "approverRole": "assessor" },
    { "minAmount": 100000, "maxAmount": 500000, "approverRole": "team_lead" },
    { "minAmount": 500000, "maxAmount": null, "approverRole": "director" }
  ]
}
```

The `processClaim()` runtime takes the claim amount, compares it against the threshold and tiers, and returns the matching approver role. If no tier matches (amount < threshold), it returns `"auto-approve"`.

The Preview mode uses this same logic to show: *"This claim for RM 75,000 would be routed to an Assessor."*

## Key Edge Cases to Handle

- **Claim amount exactly equals a tier boundary** — define whether boundaries are inclusive on the lower or upper bound (convention: lower bound inclusive, e.g., ≥ 20,000 goes to assessor)
- **Gap between tiers** — a config error where amount falls in a gap between tiers; the platform's validation should prevent this
- **Overlapping tiers** — another config error; validation should reject configs where tier ranges overlap
- **Zero threshold with tiers** — GovHealth has threshold 0 meaning every claim goes to a tier; the single tier covers all amounts (0 to ∞ → committee)
