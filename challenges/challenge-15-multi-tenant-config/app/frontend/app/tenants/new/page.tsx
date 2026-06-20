"use client";

import Link from "next/link";
import { TenantForm } from "@/components/TenantForm";
import { useCreateTenant } from "@/hooks/useTenantMutations";

export default function NewTenantPage() {
  const { submit, error } = useCreateTenant();
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/tenants"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          ← Back
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">New Tenant</h1>
      </div>
      <TenantForm onSubmit={(config, slug) => submit(slug, config)} error={error} />
    </div>
  );
}
