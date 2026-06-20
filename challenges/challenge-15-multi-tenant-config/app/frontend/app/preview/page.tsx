"use client";

import { useState } from "react";
import { useTenantList } from "@/hooks/useTenantList";
import { useProcessClaim } from "@/hooks/useProcessClaim";
import { ClaimResult } from "@/components/ClaimResult";
import { ClaimTypeEnum } from "@/lib/shared";

const today = () => new Date().toISOString().slice(0, 10);

export default function PreviewPage() {
  const { tenants, loading: tenantsLoading } = useTenantList();
  const { result, loading, error, submit } = useProcessClaim();

  const [tenantId, setTenantId] = useState("");
  const [claimType, setClaimType] = useState<(typeof ClaimTypeEnum.options)[number]>(ClaimTypeEnum.options[0]);
  const [amount, setAmount] = useState("");
  const [submissionDate, setSubmissionDate] = useState(today());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    submit(tenantId, { claimType, amount: Number(amount), submissionDate });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-xl font-semibold text-gray-900">Claim Preview</h1>

      <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tenant <span className="text-red-500">*</span>
          </label>
          <select
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select tenant…</option>
            {tenantsLoading
              ? <option disabled>Loading…</option>
              : tenants.map((t) => <option key={t.id} value={t.id}>{t.branding?.name ?? t.slug}</option>)
            }
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Claim Type <span className="text-red-500">*</span>
            </label>
            <select
              value={claimType}
              onChange={(e) => setClaimType(e.target.value as (typeof ClaimTypeEnum.options)[number])}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ClaimTypeEnum.options.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submission Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={submissionDate}
              onChange={(e) => setSubmissionDate(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !tenantId}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Processing…" : "Process Claim"}
        </button>
      </form>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && <ClaimResult result={result} />}
    </div>
  );
}
