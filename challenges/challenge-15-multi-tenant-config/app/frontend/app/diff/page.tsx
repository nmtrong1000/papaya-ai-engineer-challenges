"use client";

import { useState } from "react";
import { useTenantList } from "@/hooks/useTenantList";
import { useDiff } from "@/hooks/useDiff";
import { DiffTable } from "@/components/DiffTable";

const selectClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function DiffPage() {
  const { tenants, loading: tenantsLoading } = useTenantList();
  const [idA, setIdA] = useState("");
  const [idB, setIdB] = useState("");
  const { configA, configB, loading, error } = useDiff(idA, idB);

  const nameOf = (id: string) => {
    const t = tenants.find((t) => t.id === id);
    return t ? (t.branding?.name ?? t.slug) : id;
  };

  const showPlaceholder = !idA || !idB || idA === idB;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Config Diff</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tenant A</label>
          <select value={idA} onChange={(e) => setIdA(e.target.value)} className={selectClass}>
            <option value="">Select tenant…</option>
            {tenantsLoading
              ? <option disabled>Loading…</option>
              : tenants.filter((t) => t.id !== idB).map((t) => (
                  <option key={t.id} value={t.id}>{t.branding?.name ?? t.slug}</option>
                ))
            }
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tenant B</label>
          <select value={idB} onChange={(e) => setIdB(e.target.value)} className={selectClass}>
            <option value="">Select tenant…</option>
            {tenantsLoading
              ? <option disabled>Loading…</option>
              : tenants.filter((t) => t.id !== idA).map((t) => (
                  <option key={t.id} value={t.id}>{t.branding?.name ?? t.slug}</option>
                ))
            }
          </select>
        </div>
      </div>

      {showPlaceholder && (
        <p className="text-sm text-gray-500 text-center py-16">
          Select two different tenants to compare
        </p>
      )}

      {!showPlaceholder && error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!showPlaceholder && loading && (
        <p className="text-sm text-gray-500 text-center py-16">Loading…</p>
      )}

      {configA && configB && (
        <DiffTable configA={configA} configB={configB} nameA={nameOf(idA)} nameB={nameOf(idB)} />
      )}
    </div>
  );
}
