"use client";

import { useState } from "react";
import type { TenantVersion } from "@/hooks/useVersionHistory";
import type { TenantConfig } from "@/lib/shared";
import { TenantForm } from "@/components/TenantForm";

type Props = {
  versions: TenantVersion[];
  loading: boolean;
  error: string | null;
  slug: string;
  onRollback: (version: number) => Promise<number>;
  onPreviewRequest: (version: number) => Promise<TenantConfig>;
};

type ReviewState = {
  version: number;
  config: TenantConfig;
};

export function VersionHistory({ versions, loading, error, slug, onRollback, onPreviewRequest }: Props) {
  const [banner, setBanner] = useState<string | null>(null);
  const [rolling, setRolling] = useState(false);
  const [review, setReview] = useState<ReviewState | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const currentVersion = versions[0]?.version ?? null;

  const openReview = async (version: number) => {
    setPreviewLoading(true);
    try {
      const config = await onPreviewRequest(version);
      setReview({ version, config });
    } finally {
      setPreviewLoading(false);
    }
  };

  const confirmRollback = async () => {
    if (!review) return;
    setRolling(true);
    setBanner(null);
    try {
      const newVersion = await onRollback(review.version);
      setBanner(`Rolled back to version ${review.version}. New version ${newVersion} created.`);
      setReview(null);
    } finally {
      setRolling(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-500 py-4">Loading history…</p>;
  if (error) return <p className="text-sm text-red-600 py-4">{error}</p>;

  return (
    <div className="space-y-4">
      {banner && (
        <div className="flex items-center justify-between rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <span>{banner}</span>
          <button onClick={() => setBanner(null)} className="ml-4 text-green-600 hover:text-green-800 font-medium">✕</button>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-4 py-2 font-medium text-gray-600">Version</th>
              <th className="px-4 py-2 font-medium text-gray-600">Created</th>
              <th className="px-4 py-2 font-medium text-gray-600">Note</th>
              <th className="px-4 py-2 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {versions.map((v) => {
              const isCurrent = v.version === currentVersion;
              return (
                <tr key={v.id} className={isCurrent ? "bg-blue-50" : "hover:bg-gray-50"}>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openReview(v.version)}
                      disabled={previewLoading}
                      className="font-medium text-blue-600 hover:underline disabled:opacity-50"
                    >
                      v{v.version}
                    </button>
                    {isCurrent && (
                      <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        current
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{new Date(v.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2 text-gray-600">{v.note ?? "—"}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      disabled={isCurrent || rolling || previewLoading}
                      onClick={() => openReview(v.version)}
                      className="px-3 py-1 text-xs font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Roll back
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {review && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h2 className="text-base font-semibold text-gray-900">
                Version {review.version} — Read-only preview
              </h2>
              <button
                onClick={() => setReview(null)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 overflow-y-auto flex-1">
              <TenantForm
                key={review.version}
                defaultValues={review.config}
                slug={slug}
                isEditMode
                readOnly
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setReview(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {review.version !== currentVersion && (
                <button
                  onClick={confirmRollback}
                  disabled={rolling}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {rolling ? "Rolling back…" : "Confirm rollback"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
