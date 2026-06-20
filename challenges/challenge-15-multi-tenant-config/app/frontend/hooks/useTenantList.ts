"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";

export type TenantSummary = {
  id: string;
  slug: string;
  branding: { name: string } | null;
};

export function useTenantList() {
  const [tenants, setTenants] = useState<TenantSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<TenantSummary[]>("/tenants");
      setTenants(data);
    } catch (err: any) {
      setError(err.message ?? "Failed to load tenants");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTenants(); }, [fetchTenants]);

  const deleteTenant = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await apiFetch(`/tenants/${id}`, { method: "DELETE" });
      await fetchTenants();
    } finally {
      setDeletingId(null);
    }
  }, [fetchTenants]);

  return { tenants, loading, error, deleteTenant, deletingId };
}
