"use client";

import { TenantForm } from "@/components/TenantForm";
import { useCreateTenant } from "@/hooks/useTenantMutations";

export default function NewTenantPage() {
  const { submit, error } = useCreateTenant();
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">New Tenant</h1>
      <TenantForm onSubmit={(config, slug) => submit(slug, config)} error={error} />
    </div>
  );
}
