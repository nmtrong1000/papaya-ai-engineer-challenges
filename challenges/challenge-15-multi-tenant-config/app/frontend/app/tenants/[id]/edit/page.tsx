"use client";

import { use } from "react";
import { TenantForm } from "@/components/TenantForm";
import { useTenant } from "@/hooks/useTenant";

export default function EditTenantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { config, loading, error } = useTenant(id);

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading…</div>;
  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;
  if (!config) return null;

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">{config.branding.name}</h1>
      <TenantForm defaultValues={config} onSubmit={async () => {}} />
    </div>
  );
}
