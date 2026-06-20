import { tenantService } from "../../services/tenantService";
import { tenantRepository } from "../../repositories/tenantRepository";
import type { TenantConfig } from "../../lib/shared";

export const minimalConfig: TenantConfig = {
  branding: { name: "Test Tenant", logoUrl: "", primaryColor: "#000000", secondaryColor: "#ffffff" },
  autoApprovalThreshold: 5000,
  claimTypes: [
    { type: "OUTPATIENT", requiredDocs: [], optionalDocs: [], slaDays: 7, escalateTo: "" },
  ],
  approvalTiers: [
    { minAmount: 5000, maxAmount: 50000, approverRole: "assessor", tierOrder: 1 },
  ],
  notifications: [],
  customFields: [],
};

export async function seedTestTenant(slug: string): Promise<string> {
  const tenant = await tenantService.createTenant(slug, minimalConfig);
  return tenant!.id;
}

export async function cleanupTestTenant(id: string): Promise<void> {
  try {
    await tenantRepository.delete(id);
  } catch {
    // already deleted
  }
}
