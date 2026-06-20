"use client";

import { use } from "react";
import { TenantForm } from "@/components/TenantForm";
import { useTenant } from "@/hooks/useTenant";
import { useUpdateTenant } from "@/hooks/useTenantMutations";

export default function EditTenantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { config, loading, error: loadError } = useTenant(id);
  const { submit, error: saveError } = useUpdateTenant(id);

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading…</div>;
  if (loadError) return <div className="p-6 text-sm text-red-600">{loadError}</div>;
  if (!config) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">{config.branding.name}</h1>
      <TenantForm
        defaultValues={config}
        slug={config.slug}
        isEditMode
        onSubmit={(data) => submit(data)}
        error={saveError}
      />
    </div>
  );
}
