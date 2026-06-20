import type { Request, Response, NextFunction } from "express";
import { ClaimDataSchema } from "../lib/shared";
import { ErrorCode, ErrorMessage } from "../constants";
import { tenantService } from "../services/tenantService";
import { claimService } from "../services/claimService";

export const claimController = {
  processClaim: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = ClaimDataSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: { code: ErrorCode.VALIDATION_ERROR, message: ErrorMessage.VALIDATION_ERROR, details: parsed.error.flatten() } });
      }
      const tenant = await tenantService.getTenantById(req.params.id);
      const config = {
        branding: tenant.branding!,
        autoApprovalThreshold: tenant.autoApprovalThreshold,
        approvalTiers: tenant.approvalTiers.map((t) => ({
          minAmount: t.minAmount,
          maxAmount: t.maxAmount,
          approverRole: t.approverRole,
          tierOrder: t.tierOrder,
        })),
        claimTypes: tenant.claimTypes.map((ct) => ({
          type: ct.claimType.name as any,
          requiredDocs: ct.requiredDocs,
          optionalDocs: ct.optionalDocs,
          slaDays: ct.slaDays,
          escalateTo: ct.escalateTo,
        })),
        notifications: tenant.notifications.map((n) => ({
          event: n.event as any,
          channels: n.channels as any,
          emailTemplate: n.emailTemplate ?? null,
        })),
        customFields: tenant.customFields.map((f) => ({
          name: f.name,
          fieldKey: f.fieldKey,
          type: f.fieldType as any,
          required: f.required,
          options: f.options,
          fieldOrder: f.fieldOrder,
        })),
      };
      const result = claimService.processClaim(config, parsed.data);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  },
};
