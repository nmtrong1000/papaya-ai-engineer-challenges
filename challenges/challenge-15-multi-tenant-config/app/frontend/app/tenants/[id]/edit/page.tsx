"use client";

import { use, useState } from "react";
import Link from "next/link";
import { TenantForm } from "@/components/TenantForm";
import { VersionHistory } from "@/components/VersionHistory";
import { useTenant } from "@/hooks/useTenant";
import { useUpdateTenant, useDeleteTenant } from "@/hooks/useTenantMutations";
import { useVersionHistory } from "@/hooks/useVersionHistory";

type Tab = "edit" | "history";

export default function EditTenantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tab, setTab] = useState<Tab>("edit");
  const [configKey, setConfigKey] = useState(0);

  const { config, loading, error: loadError } = useTenant(id, configKey);
  const { submit, error: saveError } = useUpdateTenant(id);
  const { deleteTenant, deleting } = useDeleteTenant(id);
  const { versions, loading: versionsLoading, error: versionsError, rollback, fetchVersionConfig } = useVersionHistory(id);

  const handleRollback = async (version: number) => {
    const newVersion = await rollback(version);
    setConfigKey((k) => k + 1);
    return newVersion;
  };

  const handleDelete = () => {
    const name = config?.branding?.name ?? "this tenant";
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteTenant();
    }
  };

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading…</div>;
  if (loadError) return <div className="p-6 text-sm text-red-600">{loadError}</div>;
  if (!config) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/tenants"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          ← Back
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">{config.branding.name}</h1>
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {(["edit", "history"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "edit" ? "Edit Config" : "Version History"}
          </button>
        ))}
      </div>

      {tab === "edit" && (
        <TenantForm
          key={configKey}
          defaultValues={config}
          slug={config.slug}
          isEditMode
          onSubmit={(data) => submit(data)}
          error={saveError}
          onDelete={handleDelete}
          deleting={deleting}
        />
      )}

      {tab === "history" && (
        <VersionHistory
          versions={versions}
          loading={versionsLoading}
          error={versionsError}
          slug={config.slug}
          onRollback={handleRollback}
          onPreviewRequest={fetchVersionConfig}
        />
      )}
    </div>
  );
}
