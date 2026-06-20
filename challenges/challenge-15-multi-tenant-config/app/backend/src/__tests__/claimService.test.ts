import { describe, it, expect } from "vitest";
import { claimService } from "../services/claimService";
import type { TenantConfig } from "../lib/shared";

const baseConfig: TenantConfig = {
  branding: { name: "Test", logoUrl: "", primaryColor: "#000", secondaryColor: "#fff" },
  autoApprovalThreshold: 20000,
  claimTypes: [
    {
      type: "INPATIENT",
      requiredDocs: ["admission_record", "itemized_bill"],
      optionalDocs: ["lab_results"],
      slaDays: 10,
      escalateTo: "director",
    },
    {
      type: "OUTPATIENT",
      requiredDocs: ["receipt"],
      optionalDocs: [],
      slaDays: 5,
      escalateTo: "manager",
    },
  ],
  approvalTiers: [
    { minAmount: 20000, maxAmount: 100000, approverRole: "assessor", tierOrder: 1 },
    { minAmount: 100000, maxAmount: null, approverRole: "director", tierOrder: 2 },
  ],
  notifications: [
    { event: "claim_submitted", channels: ["email"], emailTemplate: null },
  ],
  customFields: [
    { name: "Policy Number", fieldKey: "policy_no", type: "text", required: true, options: [], fieldOrder: 1 },
  ],
};

describe("claimService.processClaim", () => {
  it("auto-approves when amount is below threshold", () => {
    const result = claimService.processClaim(baseConfig, {
      claimType: "INPATIENT",
      amount: 15000,
      submissionDate: new Date("2026-06-20"),
    });
    expect(result.autoApproved).toBe(true);
    expect(result.approvalTier).toBeNull();
  });

  it("matches correct tier when amount exceeds threshold", () => {
    const result = claimService.processClaim(baseConfig, {
      claimType: "INPATIENT",
      amount: 75000,
      submissionDate: new Date("2026-06-20"),
    });
    expect(result.autoApproved).toBe(false);
    expect(result.approvalTier?.approverRole).toBe("assessor");
  });

  it("matches director tier for amounts above 100k", () => {
    const result = claimService.processClaim(baseConfig, {
      claimType: "INPATIENT",
      amount: 150000,
      submissionDate: new Date("2026-06-20"),
    });
    expect(result.approvalTier?.approverRole).toBe("director");
  });

  it("returns required and optional docs for matched claim type", () => {
    const result = claimService.processClaim(baseConfig, {
      claimType: "INPATIENT",
      amount: 5000,
      submissionDate: new Date("2026-06-20"),
    });
    expect(result.requiredDocs).toEqual(["admission_record", "itemized_bill"]);
    expect(result.optionalDocs).toEqual(["lab_results"]);
  });

  it("calculates SLA due date skipping weekends", () => {
    // 2026-06-20 (Sat) + 10 business days = 2026-07-03 (Fri)
    const result = claimService.processClaim(baseConfig, {
      claimType: "INPATIENT",
      amount: 5000,
      submissionDate: new Date("2026-06-20"),
    });
    expect(result.slaDueDate.toISOString().slice(0, 10)).toBe("2026-07-03");
  });

  it("uses correct slaDays per claim type", () => {
    // OUTPATIENT has slaDays: 5 — 2026-06-20 (Sat) + 5 business days = 2026-06-26 (Fri)
    const result = claimService.processClaim(baseConfig, {
      claimType: "OUTPATIENT",
      amount: 5000,
      submissionDate: new Date("2026-06-20"),
    });
    expect(result.slaDueDate.toISOString().slice(0, 10)).toBe("2026-06-26");
  });

  it("passes through notifications", () => {
    const result = claimService.processClaim(baseConfig, {
      claimType: "INPATIENT",
      amount: 5000,
      submissionDate: new Date("2026-06-20"),
    });
    expect(result.notifications).toHaveLength(1);
    expect(result.notifications[0].event).toBe("claim_submitted");
  });

  it("passes through custom fields", () => {
    const result = claimService.processClaim(baseConfig, {
      claimType: "INPATIENT",
      amount: 5000,
      submissionDate: new Date("2026-06-20"),
    });
    expect(result.customFields).toHaveLength(1);
    expect(result.customFields[0].fieldKey).toBe("policy_no");
  });

  it("throws 400 when claim type is not enabled", () => {
    expect(() =>
      claimService.processClaim(baseConfig, {
        claimType: "DENTAL",
        amount: 5000,
        submissionDate: new Date("2026-06-20"),
      })
    ).toThrow();
    try {
      claimService.processClaim(baseConfig, {
        claimType: "DENTAL",
        amount: 5000,
        submissionDate: new Date("2026-06-20"),
      });
    } catch (err: any) {
      expect(err.status).toBe(400);
    }
  });
});
