import { tenantRepository } from "../repositories/tenantRepository";
import { versionRepository } from "../repositories/versionRepository";
import { tenantService } from "./tenantService";
import { migrateConfig } from "../lib/migrateConfig";
import type { TenantConfig } from "@mtc/shared";

function notFound(message: string) {
  return Object.assign(new Error(message), { status: 404 });
}

export const versionService = {
  listVersions: async (tenantId: string) => {
    const tenant = await tenantRepository.findById(tenantId);
    if (!tenant) throw notFound("Tenant not found");
    return versionRepository.findByTenantId(tenantId);
  },

  rollback: async (tenantId: string, targetVersion: number) => {
    const tenant = await tenantRepository.findById(tenantId);
    if (!tenant) throw notFound("Tenant not found");

    const snapshot = await versionRepository.findByTenantAndVersion(tenantId, targetVersion);
    if (!snapshot) throw notFound(`Version ${targetVersion} not found`);

    const versionConfig = migrateConfig(snapshot.config);
    const { schemaVersion: _schema, ...config } = versionConfig;
    await tenantService.saveTenantConfig(tenantId, config as TenantConfig, `Rollback to version ${targetVersion}`);

    const versions = await versionRepository.findByTenantId(tenantId);
    return { newVersion: versions[0].version };
  },
};
