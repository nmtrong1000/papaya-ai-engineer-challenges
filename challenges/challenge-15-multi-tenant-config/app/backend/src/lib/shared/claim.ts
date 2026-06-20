import { z } from "zod";
import { ClaimTypeEnum, NotificationSchema, CustomFieldSchema } from "./tenant";

export const ClaimDataSchema = z.object({
  claimType: ClaimTypeEnum,
  amount: z.number().int().positive(),
  submissionDate: z.coerce.date(),
});

export const ProcessClaimResultSchema = z.object({
  requiredDocs: z.array(z.string()),
  optionalDocs: z.array(z.string()),
  autoApproved: z.boolean(),
  approvalTier: z
    .object({
      approverRole: z.string(),
      tierOrder: z.number().int(),
    })
    .nullable(),
  notifications: z.array(NotificationSchema),
  slaDueDate: z.date(),
  customFields: z.array(CustomFieldSchema),
});
