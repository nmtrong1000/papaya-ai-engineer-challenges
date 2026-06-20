"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import type { TenantConfig } from "@/lib/shared";

export type TenantVersion = {
  id: string;
  version: number;
  note: string | null;
  createdAt: string;
};

export function useVersionHistory(tenantId: string) {
  const [versions, setVersions] = useState<TenantVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<TenantVersion[]>(`/tenants/${tenantId}/versions`);
      setVersions(data);
    } catch (err: any) {
      setError(err.message ?? "Failed to load versions");
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { fetch(); }, [fetch]);

  const rollback = useCallback(async (version: number): Promise<number> => {
    const data = await apiFetch<{ newVersion: number }>(
      `/tenants/${tenantId}/rollback/${version}`,
      { method: "POST" }
    );
    await fetch();
    return data.newVersion;
  }, [tenantId, fetch]);

  const fetchVersionConfig = useCallback(async (version: number): Promise<TenantConfig> => {
    const data = await apiFetch<{ version: number; config: TenantConfig }>(
      `/tenants/${tenantId}/versions/${version}`
    );
    return data.config;
  }, [tenantId]);

  return { versions, loading, error, rollback, fetchVersionConfig };
}
