import { prisma } from "../lib/prisma";

export const versionRepository = {
  findByTenantId: (tenantId: string) =>
    prisma.tenantVersion.findMany({
      where: { tenantId },
      select: { id: true, version: true, schemaVersion: true, note: true, createdAt: true },
      orderBy: { version: "desc" },
    }),

  findByTenantAndVersion: (tenantId: string, version: number) =>
    prisma.tenantVersion.findFirst({
      where: { tenantId, version },
    }),
};
