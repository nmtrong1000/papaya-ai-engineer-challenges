import { VersionConfigSchema } from "./shared";
import type { VersionConfig } from "./shared";

// Add future schemaVersion migration steps here before the final parse.
export function migrateConfig(raw: unknown): VersionConfig {
  return VersionConfigSchema.parse(raw);
}
