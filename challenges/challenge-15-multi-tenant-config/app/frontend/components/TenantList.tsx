import Link from "next/link";
import type { TenantSummary } from "@/hooks/useTenantList";

type Props = {
  tenants: TenantSummary[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
};

export function TenantList({ tenants, onDelete, deletingId }: Props) {
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      onDelete(id);
    }
  };

  return (
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
        <tr>
          <th className="px-4 py-3">Company Name</th>
          <th className="px-4 py-3">Slug</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {tenants.length === 0 ? (
          <tr>
            <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
              No tenants found.
            </td>
          </tr>
        ) : (
          tenants.map((t) => {
            const isDeleting = deletingId === t.id;
            return (
              <tr key={t.id} className={isDeleting ? "bg-red-50 opacity-60" : "hover:bg-gray-50"}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {t.branding?.name ?? t.slug}
                </td>
                <td className="px-4 py-3 text-gray-500">{t.slug}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {isDeleting ? (
                    <span className="text-sm text-gray-400">Deleting…</span>
                  ) : (
                    <>
                      <Link
                        href={`/tenants/${t.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(t.id, t.branding?.name ?? t.slug)}
                        disabled={!!deletingId}
                        className="text-red-600 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
