import { prisma } from "../lib/prisma";
import type { PrismaClient } from "../generated/prisma/client";
import type { TenantConfig, VersionConfig } from "../lib/shared";

type Tx = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

const tenantInclude = {
  branding: true,
  claimTypes: { include: { claimType: true } },
  approvalTiers: { orderBy: { tierOrder: "asc" as const } },
  notifications: true,
  customFields: { orderBy: { fieldOrder: "asc" as const } },
};

export const tenantRepository = {
  findAll: () =>
    prisma.tenant.findMany({
      include: { branding: true },
      orderBy: { createdAt: "asc" },
    }),

  findById: (id: string) =>
    prisma.tenant.findUnique({ where: { id }, include: tenantInclude }),

  create: (slug: string, tx: Tx) =>
    tx.tenant.create({ data: { slug } }),

  delete: (id: string) =>
    prisma.$transaction(async (tx) => {
      await tx.tenant.update({ where: { id }, data: { currentVersionId: null } });
      await tx.tenantVersion.deleteMany({ where: { tenantId: id } });
      await tx.customField.deleteMany({ where: { tenantId: id } });
      await tx.tenantNotification.deleteMany({ where: { tenantId: id } });
      await tx.approvalTier.deleteMany({ where: { tenantId: id } });
      await tx.tenantClaimType.deleteMany({ where: { tenantId: id } });
      await tx.branding.deleteMany({ where: { tenantId: id } });
      await tx.tenant.delete({ where: { id } });
    }),

  updateCurrentVersionId: (id: string, versionId: string, tx: Tx) =>
    tx.tenant.update({ where: { id }, data: { currentVersionId: versionId } }),

  updateAutoApprovalThreshold: (id: string, threshold: number, tx: Tx) =>
    tx.tenant.update({ where: { id }, data: { autoApprovalThreshold: threshold } }),

  upsertBranding: (tenantId: string, branding: TenantConfig["branding"], tx: Tx) =>
    tx.branding.upsert({
      where: { tenantId },
      create: { tenantId, ...branding },
      update: { ...branding },
    }),

  replaceApprovalTiers: async (tenantId: string, tiers: TenantConfig["approvalTiers"], tx: Tx) => {
    await tx.approvalTier.deleteMany({ where: { tenantId } });
    if (tiers.length > 0) {
      await tx.approvalTier.createMany({
        data: tiers.map((t) => ({ tenantId, ...t })),
      });
    }
  },

  replaceTenantClaimTypes: async (tenantId: string, claimTypes: TenantConfig["claimTypes"], tx: Tx) => {
    await tx.tenantClaimType.deleteMany({ where: { tenantId } });
    for (const ct of claimTypes) {
      const claimType = await tx.claimType.findUniqueOrThrow({ where: { name: ct.type } });
      await tx.tenantClaimType.create({
        data: {
          tenantId,
          claimTypeId: claimType.id,
          requiredDocs: ct.requiredDocs,
          optionalDocs: ct.optionalDocs,
          slaDays: ct.slaDays,
          escalateTo: ct.escalateTo,
        },
      });
    }
  },

  replaceNotifications: async (tenantId: string, notifications: TenantConfig["notifications"], tx: Tx) => {
    await tx.tenantNotification.deleteMany({ where: { tenantId } });
    if (notifications.length > 0) {
      await tx.tenantNotification.createMany({
        data: notifications.map((n) => ({
          tenantId,
          event: n.event,
          channels: n.channels,
          emailTemplate: n.emailTemplate ?? null,
        })),
      });
    }
  },

  replaceCustomFields: async (tenantId: string, customFields: TenantConfig["customFields"], tx: Tx) => {
    await tx.customField.deleteMany({ where: { tenantId } });
    if (customFields.length > 0) {
      await tx.customField.createMany({
        data: customFields.map((f) => ({
          tenantId,
          name: f.name,
          fieldKey: f.fieldKey,
          fieldType: f.type,
          required: f.required,
          options: f.options,
          fieldOrder: f.fieldOrder,
        })),
      });
    }
  },

  getNextVersionNumber: async (tenantId: string, tx: Tx) => {
    const agg = await tx.tenantVersion.aggregate({
      where: { tenantId },
      _max: { version: true },
    });
    return (agg._max.version ?? 0) + 1;
  },

  createVersion: (tenantId: string, version: number, config: VersionConfig, note: string | undefined, tx: Tx) =>
    tx.tenantVersion.create({
      data: { tenantId, version, schemaVersion: 1, config: config as object, note: note ?? null },
    }),
};
