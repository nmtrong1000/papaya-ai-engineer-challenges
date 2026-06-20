export const ErrorCode = {
  MISSING_SLUG:      "MISSING_SLUG",
  SLUG_CONFLICT:     "SLUG_CONFLICT",
  VALIDATION_ERROR:  "VALIDATION_ERROR",
  INVALID_VERSION:   "INVALID_VERSION",
  NOT_FOUND:         "NOT_FOUND",
  INTERNAL_ERROR:    "INTERNAL_ERROR",
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

export const ErrorMessage: Record<ErrorCode, string> = {
  MISSING_SLUG:      "slug is required",
  SLUG_CONFLICT:     "Slug already in use",
  VALIDATION_ERROR:  "Validation error",
  INVALID_VERSION:   "version must be an integer",
  NOT_FOUND:         "Resource not found",
  INTERNAL_ERROR:    "Internal server error",
};

export const INSURANCE_DOCS = [
  { key: "admission_record",      label: "Admission Record" },
  { key: "dental_receipt",        label: "Dental Receipt" },
  { key: "diagnosis_note",        label: "Diagnosis Note" },
  { key: "discharge_summary",     label: "Discharge Summary" },
  { key: "doctors_report",        label: "Doctor's Report" },
  { key: "itemized_bill",         label: "Itemized Bill" },
  { key: "lab_results",           label: "Lab Results" },
  { key: "maternity_certificate", label: "Maternity Certificate" },
  { key: "medical_receipt",       label: "Medical Receipt" },
  { key: "optical_prescription",  label: "Optical Prescription" },
  { key: "pharmacy_receipt",      label: "Pharmacy Receipt" },
  { key: "referral_letter",       label: "Referral Letter" },
  { key: "specialist_report",     label: "Specialist Report" },
  { key: "treatment_plan",        label: "Treatment Plan" },
  { key: "xray_images",           label: "X-Ray Images" },
] as const;

export const ESCALATION_ROLES = [
  { value: "claims_manager",        label: "Claims Manager" },
  { value: "senior_claims_manager", label: "Senior Claims Manager" },
  { value: "supervisor",            label: "Supervisor" },
  { value: "manager",               label: "Manager" },
  { value: "director",              label: "Director" },
  { value: "compliance_officer",    label: "Compliance Officer" },
  { value: "medical_reviewer",      label: "Medical Reviewer" },
  { value: "underwriter",           label: "Underwriter" },
] as const;

export const APPROVER_ROLES = [
  { value: "assessor",              label: "Assessor" },
  { value: "senior_assessor",       label: "Senior Assessor" },
  { value: "claims_manager",        label: "Claims Manager" },
  { value: "senior_claims_manager", label: "Senior Claims Manager" },
  { value: "team_lead",             label: "Team Lead" },
  { value: "supervisor",            label: "Supervisor" },
  { value: "officer",               label: "Officer" },
  { value: "manager",               label: "Manager" },
  { value: "director",              label: "Director" },
  { value: "committee",             label: "Committee" },
  { value: "compliance_officer",    label: "Compliance Officer" },
  { value: "medical_reviewer",      label: "Medical Reviewer" },
  { value: "underwriter",           label: "Underwriter" },
] as const;

export const NOTIFICATION_EVENT_LABELS: Record<string, string> = {
  claim_submitted: "Claim Submitted",
  approved:        "Approved",
  rejected:        "Rejected",
  payment_sent:    "Payment Sent",
};
