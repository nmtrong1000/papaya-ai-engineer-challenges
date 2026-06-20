# Claim Workflows

## What It Is

A claim workflow is the ordered sequence of steps a claim must pass through — from the moment a policyholder submits it to the moment payment is issued or the claim is rejected. It defines *who does what, in what order, and under what conditions*.

Think of it as a flowchart that lives inside the insurer's operations system. Every claim enters at step 1 and travels through the workflow until it reaches a terminal state (paid, rejected, or closed).

## Why It Exists

Without a defined workflow, each claims handler would process claims however they see fit — some might approve without checking documents, others might escalate everything to a manager. A workflow enforces consistency, auditability, and compliance. Regulators in most countries require insurers to document and follow their claim handling process.

## The Typical Stages

| Stage | What Happens |
|-------|--------------|
| **1. Submission / FNOL** | Policyholder submits the claim — this is called the **First Notice of Loss (FNOL)** in the industry. Basic data is captured: claim type, amount, date of service. The claim is assigned to the correct adjuster or queue. |
| **2. Document Collection** | System or handler checks which documents are required for this claim type. Policyholder uploads them. |
| **3. Registration / Intake** | Claim is assigned a unique ID, logged in the system, and routed to the correct queue. |
| **4. Triage / Validation** | Automated checks: Is the policy active? Is the claim type covered? Is the amount within benefit limits? Obvious rejections are filtered here. |
| **5. Assessment** | A claims assessor (called a **claims adjuster** in US/global markets) reviews documents, verifies the claim against policy terms, and decides: approve, query, or reject. |
| **6. Approval / Escalation** | Depending on the claim amount or complexity, it may need sign-off from a supervisor, team lead, or director before payment is authorized. |
| **7. Payment Processing** | Approved claim is handed to finance for payment execution. Payment is sent to the policyholder or provider. This step has its own SLA: typically 3–7 business days from approval to payment issuance. |
| **8. Notification** | Policyholder is notified of the outcome (approved, rejected, or payment sent) via email, SMS, or app. |
| **9. Closure** | Claim is marked closed. Available for audit and reporting. |

> **Industry terms to know:** "FNOL" (First Notice of Loss) = the moment a claim is first reported. "Claims adjuster" (US/global) = "assessor" (common in Asian markets). Both refer to the person who investigates and evaluates the claim.

## Types of Workflows

### By Automation Level
- **Straight-Through Processing (STP):** Low-value, low-risk claims are approved automatically with no human involvement. Fast but requires tight rules to avoid fraud.
- **Semi-Automated:** System handles intake and validation; a human does final review and approval.
- **Fully Manual:** Every step involves a human. Used for complex, high-value, or disputed claims.

### By Claim Type
Different claim types often have different workflows even within the same insurer:
- **Outpatient:** Usually short (submit receipt → validate → auto-approve or quick assessor review → pay)
- **Inpatient:** Longer (pre-authorization step before treatment + post-treatment document review)
- **Maternity:** May require pre-registration at a specific hospital, staged payments
- **Dental / Optical:** Often capped at a fixed benefit per year; workflow checks remaining benefit balance

### By Trigger
- **Reactive:** Policyholder initiates after the event (most common)
- **Pre-authorization:** Policyholder must get approval *before* treatment (common for inpatient / surgeries)
- **Direct billing:** Provider submits the claim on behalf of the patient (policyholder never touches the claim)

## What "Tenant-Configurable" Means in This Challenge

In this platform, tenants (insurers) can configure:
- Which claim types are enabled (which workflow paths exist)
- The auto-approval threshold (determines where STP vs. manual review kicks in)
- Approval tiers (who must sign off at each amount range)
- Which documents are required at the Document Collection stage
- SLA targets (how many days each stage must complete within)
- Notifications (which events trigger messages and via which channels)

The workflow *structure* (the sequence of stages) is the same for all tenants. What differs is the *rules* applied at each stage.

## Common Pain Points That This Platform Solves

- A new insurer with different rules requires a code change to configure their workflow → solved by config-driven rules
- Operations can't see why a claim was routed a certain way → solved by the Preview mode (shows routing decision for any claim + tenant)
- A config change breaks claims already in progress → solved by version history + rollback
