import type { TenantConfig } from "./shared";

const cache = new Map<string, TenantConfig>();

export const configCache = {
  get: (tenantId: string) => cache.get(tenantId),
  set: (tenantId: string, config: TenantConfig) => cache.set(tenantId, config),
  invalidate: (tenantId: string) => cache.delete(tenantId),
};
