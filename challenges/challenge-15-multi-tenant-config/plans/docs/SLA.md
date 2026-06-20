# SLA (Service Level Agreement)

## What It Is

An SLA (Service Level Agreement) is a formal commitment from the insurer to process claims within a defined timeframe. It sets the clock: once a complete claim is received, the insurer has X business days to reach a final decision (approve, reject, or request more information).

In plain terms: "We promise to process your outpatient claim within 5 business days of receiving all required documents."

## Why It Exists

- **Regulatory requirement:** Many insurance regulators mandate minimum turnaround times. Breaching them can result in fines or license issues.
- **Policyholder trust:** People submitting claims are often in financial stress (just paid a hospital bill). Fast, predictable processing is a key product differentiator.
- **Contractual obligation:** Corporate clients (e.g., an employer buying group health insurance for staff) negotiate SLA terms into their contracts. Breach = financial penalty for the insurer.
- **Operational discipline:** Without a deadline, claims can sit in queues indefinitely. SLAs force internal prioritization.

## Key Terms

| Term | Meaning |
|------|---------|
| **SLA target** | The promised maximum number of business days to process a claim |
| **Business days** | Working days only — weekends and public holidays excluded |
| **SLA clock start** | Usually when the *complete* claim is received (all required documents submitted) — not the initial submission date |
| **SLA breach** | When the SLA target is exceeded without a final decision |
| **Early warning threshold** | An alert triggered before breach — typically at 70–80% of the SLA deadline — so action can be taken proactively |
| **Days in status** | How long a claim has sat at a given workflow stage; used for aging metrics and SLA dashboards |
| **Escalation** | Automated action triggered on SLA breach (or early warning) — notify a supervisor, reprioritize the queue, alert the ops team |
| **Payment SLA** | A separate downstream SLA: once a claim is approved, payment must be issued within 3–7 business days |

## Business Days vs. Calendar Days

This distinction matters significantly in calculation:

- A claim submitted Friday with a 5-business-day SLA is due the following Friday (not Wednesday).
- Public holidays extend the deadline further.
- Some insurers use calendar days for simplicity; regulated markets often mandate business days.

In this challenge, SLA is expressed in **business days** per the brief's spec.

## SLA Targets by Claim Type

Different claim types have different natural complexity, which drives different SLA targets:

| Claim Type | Typical SLA Range | Why |
|------------|------------------|-----|
| Outpatient | 3–7 business days | Simple: one receipt, one doctor note. Low document volume. Clean electronic claims can settle at the fast end. |
| Inpatient | 10–14 business days | Complex: multiple documents, high amounts, may need medical officer review |
| Dental | 3–5 business days | Moderate complexity; usually well-documented |
| Maternity | 7–10 business days | Multi-stage documentation (delivery record, birth cert, itemized bill) |
| Optical | 2–5 business days | Simple: receipt + prescription |

> **Industry benchmark:** Health insurance claims in general take **15–30 days** end-to-end in the real world (accounting for incomplete submissions, appeals, and edge cases). The ranges above are targets for clean, complete claims. The tenant SLA configs in this challenge (5–15 days) are aggressive but realistic for well-documented claims with automated triage.

## How This Differs Between Tenants

| Tenant | SLA Approach | Reason |
|--------|-------------|--------|
| SafeGuard (Corporate) | 5 days outpatient, 10 days inpatient | Contractual obligation with corporate clients; differentiated by type |
| HealthFirst (Retail) | 7 days for all types | Simpler flat SLA; retail policyholders have no negotiating power to demand differentiation |
| GovHealth (Government) | 15 days for all types | Government bureaucracy + committee approval requirement means longer processing is standard and regulated |

## Escalation Rules

Good SLA management is proactive, not reactive. The industry standard is a two-stage escalation model:

**Stage 1 — Early Warning (70–80% of SLA elapsed):** Alert is sent to the assigned assessor and their supervisor. The claim is flagged on dashboards. No external action yet — this is an internal nudge to act now.

**Stage 2 — Breach (100% of SLA elapsed):** Escalation triggers. The claim is reprioritized, a senior approver is notified, and in regulated markets the breach is logged for regulatory reporting.

Common escalation response types:

| Escalation Type | What Happens |
|-----------------|-------------|
| **Supervisor alert** | Claim manager is notified that this claim is overdue |
| **Queue reprioritization** | Claim jumps to the top of the assessor's queue |
| **Policyholder notification** | Policyholder is proactively told there is a delay and given an updated estimate |
| **Penalty tracking** | System logs the breach for regulatory reporting or contract penalty calculation |
| **Automatic escalation to senior approver** | If an assessor hasn't acted in time, the claim auto-escalates to their manager |

In this challenge, escalation is configured per tenant as: *if SLA is breached, notify [role/channel]*.

## SLA in the `processClaim()` Function

Given a claim's submission date and the tenant's SLA target for that claim type, the runtime computes the **SLA deadline**:

```
submissionDate = 2026-06-19 (Thursday)
SLA target     = 5 business days
SLA deadline   = 2026-06-26 (Thursday, skipping weekend)
```

The function returns this deadline date so the claims handler knows exactly when the clock runs out.

## What "Tenant-Configurable" Means in This Challenge

```json
{
  "sla": {
    "OUTPATIENT": { "targetDays": 5, "escalateTo": "claims_manager" },
    "INPATIENT":  { "targetDays": 10, "escalateTo": "director" },
    "DENTAL":     { "targetDays": 5, "escalateTo": "claims_manager" }
  }
}
```

Only enabled claim types need SLA entries. The `processClaim()` runtime looks up the claim type in this map, calculates the deadline from the submission date, and returns it alongside the escalation contact.

## Validation Rules

- SLA target must be a positive integer (≥ 1 business day) — the form validation blocks zero or negative values
- Every enabled claim type must have an SLA entry — a claim type enabled with no SLA target is a config error
- The `escalateTo` field is optional; if omitted, breach is logged but no notification is sent
