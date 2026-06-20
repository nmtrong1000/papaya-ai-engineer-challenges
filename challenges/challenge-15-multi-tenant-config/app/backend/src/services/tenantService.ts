import { prisma } from "../lib/prisma";
import { configCache } from "../lib/configCache";
import { tenantRepository as repo } from "../repositories/tenantRepository";
import type { TenantConfig, VersionConfig } from "@mtc/shared";

function buildSnapshot(config: TenantConfig): VersionConfig {
  return { schemaVersion: 1, ...config };
}

async function saveTenantConfig(tenantId: string, config: TenantConfig, note?: string) {
  await prisma.$transaction(async (tx) => {
    await repo.upsertBranding(tenantId, config.branding, tx);
    await repo.updateAutoApprovalThreshold(tenantId, config.autoApprovalThreshold, tx);
    await repo.replaceApprovalTiers(tenantId, config.approvalTiers, tx);
    await repo.replaceTenantClaimTypes(tenantId, config.claimTypes, tx);
    await repo.replaceNotifications(tenantId, config.notifications, tx);
    await repo.replaceCustomFields(tenantId, config.customFields, tx);
    const versionNumber = await repo.getNextVersionNumber(tenantId, tx);
    const snapshot = buildSnapshot(config);
    const version = await repo.createVersion(tenantId, versionNumber, snapshot, note, tx);
    await repo.updateCurrentVersionId(tenantId, version.id, tx);
  });
  configCache.invalidate(tenantId);
}

export const tenantService = {
  saveTenantConfig,

  listTenants: () => repo.findAll(),

  getTenantById: async (id: string) => {
    const tenant = await repo.findById(id);
    if (!tenant) {
      const err = Object.assign(new Error("Tenant not found"), { status: 404 });
      throw err;
    }
    return tenant;
  },

  createTenant: async (slug: string, config: TenantConfig) => {
    let tenantId: string;
    await prisma.$transaction(async (tx) => {
      const tenant = await repo.create(slug, tx);
      tenantId = tenant.id;
    });
    await saveTenantConfig(tenantId!, config, "Initial config");
    return repo.findById(tenantId!);
  },

  updateTenant: async (id: string, config: TenantConfig) => {
    await tenantService.getTenantById(id);
    await saveTenantConfig(id, config);
    return repo.findById(id);
  },

  deleteTenant: async (id: string) => {
    await tenantService.getTenantById(id);
    configCache.invalidate(id);
    return repo.delete(id);
  },
};
