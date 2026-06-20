"use client";

import Link from "next/link";
import { useTenantList } from "@/hooks/useTenantList";
import { TenantList } from "@/components/TenantList";

export default function TenantsPage() {
  const { tenants, loading, error, deleteTenant, deletingId } = useTenantList();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Tenants</h1>
        <Link
          href="/tenants/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          New Tenant
        </Link>
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!loading && !error && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <TenantList tenants={tenants} onDelete={deleteTenant} deletingId={deletingId} />
        </div>
      )}
    </div>
  );
}
