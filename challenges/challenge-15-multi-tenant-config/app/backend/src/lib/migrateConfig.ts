import { VersionConfigSchema } from "@mtc/shared";
import type { VersionConfig } from "@mtc/shared";

// Add future schemaVersion migration steps here before the final parse.
export function migrateConfig(raw: unknown): VersionConfig {
  return VersionConfigSchema.parse(raw);
}
