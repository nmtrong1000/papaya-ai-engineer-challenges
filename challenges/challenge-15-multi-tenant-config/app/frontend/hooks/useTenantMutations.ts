"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { TenantConfig } from "@mtc/shared";

type MutationState = { submitting: boolean; error: string | null };

export function useCreateTenant() {
  const router = useRouter();
  const [state, setState] = useState<MutationState>({ submitting: false, error: null });

  const submit = async (slug: string, config: TenantConfig) => {
    setState({ submitting: true, error: null });
    try {
      await apiFetch("/tenants", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, ...config }) });
      router.push("/tenants");
    } catch (err) {
      setState({ submitting: false, error: err instanceof Error ? err.message : "Something went wrong" });
    }
  };

  return { submit, submitting: state.submitting, error: state.error };
}

export function useUpdateTenant(id: string) {
  const router = useRouter();
  const [state, setState] = useState<MutationState>({ submitting: false, error: null });

  const submit = async (config: TenantConfig) => {
    setState({ submitting: true, error: null });
    try {
      await apiFetch(`/tenants/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
      router.push("/tenants");
    } catch (err) {
      setState({ submitting: false, error: err instanceof Error ? err.message : "Something went wrong" });
    }
  };

  return { submit, submitting: state.submitting, error: state.error };
}

export function useDeleteTenant(id: string) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const deleteTenant = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/tenants/${id}`, { method: "DELETE" });
      router.push("/tenants");
    } catch {
      setDeleting(false);
    }
  };

  return { deleteTenant, deleting };
}
