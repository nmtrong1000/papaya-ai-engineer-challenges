# Document Requirements

## What It Is

Document requirements define which physical or digital files a policyholder must submit alongside a claim in order for it to be processed. They act as evidence — proving that the event happened, that the cost was incurred, and that the claim is legitimate.

They are not one-size-fits-all. Requirements differ by insurer, by claim type, and sometimes by claim amount. An outpatient visit for a headache needs a receipt and a doctor's note; an inpatient surgery needs an admission record, discharge summary, surgical report, and itemized hospital bill.

## Why They Exist

- **Fraud prevention:** Documents make it harder to fabricate claims (you can't easily fake a hospital discharge summary with matching dates and doctor signatures).
- **Policy verification:** Confirm the treatment matches what the policy actually covers.
- **Regulatory compliance:** Many insurance regulators require specific evidence to be retained for audit purposes.
- **Correct payment calculation:** Some documents (itemized bills, benefit summaries) provide the exact breakdown needed to apply benefit limits correctly.

## Cashless vs. Reimbursement Claims

This is a fundamental distinction that affects what documents are required and *when* they must be submitted.

| Type | How It Works | Who Submits Documents |
|------|-------------|----------------------|
| **Cashless** | Insurer pays the hospital directly. Policyholder never handles money. Only possible at network (panel) hospitals. | Hospital submits most documents on behalf of the patient. Policyholder just needs a pre-authorization form. |
| **Reimbursement** | Policyholder pays the bill first, then submits a claim to the insurer to get repaid. Works at any hospital. | Policyholder must submit all documents in original, plus bank details for payment transfer. |

**Pre-authorization (cashless only):** For planned procedures, the policyholder or hospital must submit a pre-authorization form 3–4 days in advance. For emergencies, it must be submitted within 24 hours of admission.

**Submission deadline:** Most insurers require claims to be submitted within 30 days of discharge or treatment. Late submissions are typically rejected.

In this challenge, the `processClaim()` function operates in a reimbursement model (policyholder-initiated claim with document checklist). Cashless flow is out of scope.

## Required vs. Optional Documents

| Category | Meaning | Example |
|----------|---------|---------|
| **Required** | Claim cannot proceed without this document. Submission is blocked until it is uploaded. | Medical receipt, diagnosis letter |
| **Optional** | Provides additional context but is not a blocker. Assessors may request it if needed. | Referral letter, previous medical records |

## Common Document Types by Claim Category

### Outpatient (Clinic Visit, GP, Specialist)
| Document | Required / Optional |
|----------|---------------------|
| Official medical receipt (itemized) | Required |
| Doctor's diagnosis / consultation note | Required |
| Prescription (if medications claimed) | Required |
| Referral letter (if specialist visit) | Optional |
| Lab / imaging results | Optional |

### Inpatient (Hospitalization)
| Document | Required / Optional |
|----------|---------------------|
| Hospital admission record | Required |
| Hospital discharge summary | Required |
| Itemized hospital bill | Required |
| Surgical / procedure report | Required (if surgery) |
| Attending doctor's report | Required |
| Pre-authorization approval (if applicable) | Required |
| Blood / lab results | Optional |

### Dental
| Document | Required / Optional |
|----------|---------------------|
| Dental receipt | Required |
| Dentist's treatment plan / chart | Required |
| X-rays (for major dental work) | Optional |

### Maternity
| Document | Required / Optional |
|----------|---------------------|
| Hospital delivery record | Required |
| Itemized maternity bill | Required |
| Baby's birth certificate | Required |
| Pre-natal check records | Optional |

### Optical
| Document | Required / Optional |
|----------|---------------------|
| Optician's receipt | Required |
| Prescription from optometrist | Required |
| Eye test report | Optional |

## How This Differs Between Tenants

Different insurers have different risk appetites and regulatory environments:

| Tenant | Dental Required Docs | Why Different |
|--------|----------------------|---------------|
| SafeGuard (Corporate) | Receipt + Treatment Plan | Standard corporate policy |
| HealthFirst (Retail) | Receipt only | Simplified retail product, lower fraud risk tolerance offset by lower limits |
| GovHealth (Government) | Receipt + Treatment Plan + X-rays for any procedure > basic cleaning | Government mandate requires stricter evidence |

## What "Tenant-Configurable" Means in This Challenge

For each enabled claim type, the tenant configuration specifies:

```
claimType: DENTAL
  required: [receipt, treatment_plan]
  optional: [xray_images, referral_letter]
```

The `processClaim()` runtime reads this and returns exactly the required/optional document list for the incoming claim's type + tenant combination. The Preview mode surfaces this to the operations team so they know what to tell the policyholder to submit.

## Implementation Note

Documents themselves (the actual files) are out of scope for this challenge. What is in scope is the *list* of document names/types that the config defines and the runtime returns. The actual upload/storage of documents would be handled by a separate document management system in a real product.
