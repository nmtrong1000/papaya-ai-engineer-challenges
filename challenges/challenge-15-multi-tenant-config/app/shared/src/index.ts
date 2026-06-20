export * from "./schemas/tenant";
export * from "./schemas/version";
export * from "./schemas/claim";
export * from "./constants";

import type { z } from "zod";
import type { TenantConfigSchema } from "./schemas/tenant";
import type { VersionConfigSchema } from "./schemas/version";
import type { ClaimDataSchema, ProcessClaimResultSchema } from "./schemas/claim";

export type TenantConfig = z.infer<typeof TenantConfigSchema>;
export type VersionConfig = z.infer<typeof VersionConfigSchema>;
export type ClaimData = z.infer<typeof ClaimDataSchema>;
export type ProcessClaimResult = z.infer<typeof ProcessClaimResultSchema>;
