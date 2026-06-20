import { z } from "zod";

export const BrandingSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().default(""),
  primaryColor: z.string().default("#000000"),
  secondaryColor: z.string().default("#ffffff"),
});

export const ClaimTypeEnum = z.enum([
  "OUTPATIENT",
  "INPATIENT",
  "DENTAL",
  "MATERNITY",
  "OPTICAL",
]);

export const ClaimTypeConfigSchema = z.object({
  type: ClaimTypeEnum,
  requiredDocs: z.array(z.string()),
  optionalDocs: z.array(z.string()),
  slaDays: z.number().int().positive(),
  escalateTo: z.string(),
});

export const ApprovalTierSchema = z.object({
  minAmount: z.number().int().min(0),
  maxAmount: z.number().int().positive().nullable(),
  approverRole: z.string().min(1),
  tierOrder: z.number().int().positive(),
});

export const NotificationEventEnum = z.enum([
  "claim_submitted",
  "approved",
  "rejected",
  "payment_sent",
]);

export const NotificationChannelEnum = z.enum(["email", "sms", "webhook"]);

export const NotificationSchema = z.object({
  event: NotificationEventEnum,
  channels: z.array(NotificationChannelEnum),
  emailTemplate: z.string().nullable(),
});

export const CustomFieldTypeEnum = z.enum(["text", "number", "select"]);

export const CustomFieldSchema = z.object({
  name: z.string().min(1),
  fieldKey: z.string().min(1),
  type: CustomFieldTypeEnum,
  required: z.boolean(),
  options: z.array(z.string()),
  fieldOrder: z.number().int().positive(),
});

export const TenantConfigSchema = z.object({
  branding: BrandingSchema,
  autoApprovalThreshold: z.number().int().min(0),
  claimTypes: z.array(ClaimTypeConfigSchema),
  approvalTiers: z.array(ApprovalTierSchema),
  notifications: z.array(NotificationSchema),
  customFields: z.array(CustomFieldSchema),
});
