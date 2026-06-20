import type { ProcessClaimResult } from "@mtc/shared";
import { INSURANCE_DOCS, NOTIFICATION_EVENT_LABELS } from "@mtc/shared";

type Props = { result: ProcessClaimResult };

const docLabel = (key: string) => INSURANCE_DOCS.find((d) => d.key === key)?.label ?? key;

export function ClaimResult({ result }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">Approval</h3>
        </div>
        <div className="px-4 py-3">
          {result.autoApproved ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              ✓ Auto-approved
            </span>
          ) : result.approvalTier ? (
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-medium">Approver Role:</span> {result.approvalTier.approverRole.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
              <p><span className="font-medium">Tier:</span> {result.approvalTier.tierOrder}</p>
            </div>
          ) : (
            <span className="text-sm text-gray-400">No approval tier matched</span>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">SLA Due Date</h3>
        </div>
        <div className="px-4 py-3 text-sm text-gray-700">
          {new Date(result.slaDueDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">Required Documents</h3>
          </div>
          <ul className="px-4 py-3 space-y-1">
            {result.requiredDocs.length === 0
              ? <li className="text-sm text-gray-400">None</li>
              : result.requiredDocs.map((d) => <li key={d} className="text-sm text-gray-700">• {docLabel(d)}</li>)
            }
          </ul>
        </div>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">Optional Documents</h3>
          </div>
          <ul className="px-4 py-3 space-y-1">
            {result.optionalDocs.length === 0
              ? <li className="text-sm text-gray-400">None</li>
              : result.optionalDocs.map((d) => <li key={d} className="text-sm text-gray-700">• {docLabel(d)}</li>)
            }
          </ul>
        </div>
      </div>

      {result.notifications.length > 0 && (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Event</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Channels</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Template</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.notifications.map((n) => (
                <tr key={n.event}>
                  <td className="px-4 py-2 text-gray-700">{NOTIFICATION_EVENT_LABELS[n.event] ?? n.event}</td>
                  <td className="px-4 py-2 text-gray-600">{n.channels.join(", ")}</td>
                  <td className="px-4 py-2 text-gray-400">{n.emailTemplate ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result.customFields.length > 0 && (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">Custom Fields Required</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Key</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.customFields.map((f) => (
                <tr key={f.fieldKey}>
                  <td className="px-4 py-2 text-gray-700">{f.name}</td>
                  <td className="px-4 py-2 font-mono text-gray-500">{f.fieldKey}</td>
                  <td className="px-4 py-2 text-gray-600">{f.type}</td>
                  <td className="px-4 py-2">{f.required ? <span className="text-red-500">Yes</span> : <span className="text-gray-400">No</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
