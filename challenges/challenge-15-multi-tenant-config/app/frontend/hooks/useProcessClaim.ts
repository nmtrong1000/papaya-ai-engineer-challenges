"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import type { ProcessClaimResult } from "@mtc/shared";

type ClaimPayload = {
  claimType: string;
  amount: number;
  submissionDate: string;
};

export function useProcessClaim() {
  const [result, setResult] = useState<ProcessClaimResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (tenantId: string, claimData: ClaimPayload) => {
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch<ProcessClaimResult>(`/tenants/${tenantId}/process-claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(claimData),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, submit };
}
