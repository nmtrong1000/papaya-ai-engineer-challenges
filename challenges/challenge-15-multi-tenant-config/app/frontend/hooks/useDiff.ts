"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import type { TenantDetail } from "./useTenant";

async function fetchDetail(id: string): Promise<TenantDetail> {
  const data = await apiFetch<any>(`/tenants/${id}`);
  return {
    id: data.id,
    slug: data.slug,
    branding: data.branding,
    autoApprovalThreshold: data.autoApprovalThreshold,
    claimTypes: data.claimTypes.map((ct: any) => ({
      type: ct.claimType.name,
      requiredDocs: ct.requiredDocs,
      optionalDocs: ct.optionalDocs,
      slaDays: ct.slaDays,
      escalateTo: ct.escalateTo,
    })),
    approvalTiers: data.approvalTiers,
    notifications: data.notifications.map((n: any) => ({
      event: n.event,
      channels: n.channels,
      emailTemplate: n.emailTemplate ?? null,
    })),
    customFields: data.customFields.map((f: any) => ({
      name: f.name,
      fieldKey: f.fieldKey,
      type: f.fieldType,
      required: f.required,
      options: f.options,
      fieldOrder: f.fieldOrder,
    })),
  };
}

export function useDiff(idA: string, idB: string) {
  const [configA, setConfigA] = useState<TenantDetail | null>(null);
  const [configB, setConfigB] = useState<TenantDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idA || !idB || idA === idB) {
      setConfigA(null);
      setConfigB(null);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([fetchDetail(idA), fetchDetail(idB)])
      .then(([a, b]) => { setConfigA(a); setConfigB(b); })
      .catch((err: any) => setError(err.message ?? "Failed to load configs"))
      .finally(() => setLoading(false));
  }, [idA, idB]);

  return { configA, configB, loading, error };
}
