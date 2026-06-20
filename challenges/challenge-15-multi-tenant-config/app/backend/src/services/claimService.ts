import { addBusinessDays } from "../lib/businessDays";
import type { TenantConfig, ClaimData, ProcessClaimResult } from "@mtc/shared";

export const claimService = {
  processClaim(config: TenantConfig, data: ClaimData): ProcessClaimResult {
    const claimTypeCfg = config.claimTypes.find((ct) => ct.type === data.claimType);
    if (!claimTypeCfg) {
      const err = Object.assign(
        new Error(`Claim type ${data.claimType} is not enabled for this tenant`),
        { status: 400 }
      );
      throw err;
    }

    const autoApproved = data.amount < config.autoApprovalThreshold;

    const approvalTier = autoApproved
      ? null
      : config.approvalTiers.find(
          (t) => data.amount >= t.minAmount && (t.maxAmount === null || data.amount < t.maxAmount)
        ) ?? null;

    const slaDueDate = addBusinessDays(data.submissionDate, claimTypeCfg.slaDays);

    return {
      requiredDocs: claimTypeCfg.requiredDocs,
      optionalDocs: claimTypeCfg.optionalDocs,
      autoApproved,
      approvalTier: approvalTier
        ? { approverRole: approvalTier.approverRole, tierOrder: approvalTier.tierOrder }
        : null,
      notifications: config.notifications,
      slaDueDate,
      customFields: config.customFields,
    };
  },
};
