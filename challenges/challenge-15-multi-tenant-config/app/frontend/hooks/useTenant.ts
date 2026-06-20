"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import type { TenantConfig } from "@/lib/shared";

export type TenantDetail = TenantConfig & {
  id: string;
  slug: string;
};

export function useTenant(id: string, _key = 0) {
  const [config, setConfig] = useState<TenantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch<any>(`/tenants/${id}`)
      .then((data) => {
        setConfig({
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
        });
      })
      .catch((err: any) => setError(err.message ?? "Failed to load tenant"))
      .finally(() => setLoading(false));
  }, [id, _key]);

  return { config, loading, error };
}
