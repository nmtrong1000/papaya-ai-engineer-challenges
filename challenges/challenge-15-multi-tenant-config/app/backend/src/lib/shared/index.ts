export * from "./tenant";
export * from "./version";
export * from "./claim";

import type { z } from "zod";
import type { TenantConfigSchema } from "./tenant";
import type { VersionConfigSchema } from "./version";
import type { ClaimDataSchema, ProcessClaimResultSchema } from "./claim";

export type TenantConfig = z.infer<typeof TenantConfigSchema>;
export type VersionConfig = z.infer<typeof VersionConfigSchema>;
export type ClaimData = z.infer<typeof ClaimDataSchema>;
export type ProcessClaimResult = z.infer<typeof ProcessClaimResultSchema>;
