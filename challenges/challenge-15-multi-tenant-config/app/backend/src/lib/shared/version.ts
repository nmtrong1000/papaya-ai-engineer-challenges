import { z } from "zod";
import {
  BrandingSchema,
  ClaimTypeConfigSchema,
  ApprovalTierSchema,
  NotificationSchema,
  CustomFieldSchema,
} from "./tenant";

export const VersionConfigSchema = z.object({
  schemaVersion: z.number().int().positive(),
  branding: BrandingSchema,
  autoApprovalThreshold: z.number().int().min(0),
  claimTypes: z.array(ClaimTypeConfigSchema),
  approvalTiers: z.array(ApprovalTierSchema),
  notifications: z.array(NotificationSchema),
  customFields: z.array(CustomFieldSchema),
});
