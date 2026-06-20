import { ClaimTypeEnum, NOTIFICATION_EVENT_LABELS } from "@mtc/shared";
import { DiffRow } from "./DiffRow";
import type { TenantDetail } from "@/hooks/useTenant";

type Props = {
  configA: TenantDetail;
  configB: TenantDetail;
  nameA: string;
  nameB: string;
};

function SectionHeader({ label }: { label: string }) {
  return (
    <tr>
      <th
        colSpan={3}
        className="bg-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-700 text-left"
      >
        {label}
      </th>
    </tr>
  );
}

function formatTiers(tiers: any[]): string {
  if (!tiers.length) return "None";
  return tiers
    .map((t) => `${t.approverRole} ($${Number(t.minAmount).toLocaleString()}–$${Number(t.maxAmount).toLocaleString()})`)
    .join(", ");
}

export function DiffTable({ configA, configB, nameA, nameB }: Props) {
  const ALL_TYPES = ClaimTypeEnum.options;
  const ALL_EVENTS = Object.keys(NOTIFICATION_EVENT_LABELS);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-4 py-2 text-sm font-medium text-gray-600 w-44">Field</th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-900">
              <span className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: configA.branding?.primaryColor ?? "#6b7280" }}
                />
                {nameA}
              </span>
            </th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-900">
              <span className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: configB.branding?.primaryColor ?? "#6b7280" }}
                />
                {nameB}
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <SectionHeader label="Branding" />
          <DiffRow label="Name" valueA={configA.branding?.name ?? ""} valueB={configB.branding?.name ?? ""} />
          <DiffRow label="Logo URL" valueA={configA.branding?.logoUrl ?? ""} valueB={configB.branding?.logoUrl ?? ""} />
          <DiffRow label="Primary Color" valueA={configA.branding?.primaryColor ?? ""} valueB={configB.branding?.primaryColor ?? ""} />
          <DiffRow label="Secondary Color" valueA={configA.branding?.secondaryColor ?? ""} valueB={configB.branding?.secondaryColor ?? ""} />

          <SectionHeader label="Approval Rules" />
          <DiffRow
            label="Auto-approval"
            valueA={`$${configA.autoApprovalThreshold.toLocaleString()}`}
            valueB={`$${configB.autoApprovalThreshold.toLocaleString()}`}
          />
          <DiffRow
            label="Tier count"
            valueA={String(configA.approvalTiers.length)}
            valueB={String(configB.approvalTiers.length)}
          />
          <DiffRow
            label="Tiers"
            valueA={formatTiers(configA.approvalTiers)}
            valueB={formatTiers(configB.approvalTiers)}
          />

          <SectionHeader label="Claim Types" />
          {ALL_TYPES.map((type) => {
            const ctA = configA.claimTypes.find((ct: any) => ct.type === type);
            const ctB = configB.claimTypes.find((ct: any) => ct.type === type);
            return (
              <DiffRow
                key={type}
                label={type}
                valueA={ctA ? `Enabled (${ctA.slaDays} days)` : "Disabled"}
                valueB={ctB ? `Enabled (${ctB.slaDays} days)` : "Disabled"}
              />
            );
          })}

          <SectionHeader label="Notifications" />
          {ALL_EVENTS.map((event) => {
            const nA = configA.notifications.find((n: any) => n.event === event);
            const nB = configB.notifications.find((n: any) => n.event === event);
            return (
              <DiffRow
                key={event}
                label={NOTIFICATION_EVENT_LABELS[event]}
                valueA={nA ? nA.channels.join(", ") : ""}
                valueB={nB ? nB.channels.join(", ") : ""}
              />
            );
          })}

          <SectionHeader label="Custom Fields" />
          <DiffRow
            label="Count"
            valueA={String(configA.customFields.length)}
            valueB={String(configB.customFields.length)}
          />
          <DiffRow
            label="Fields"
            valueA={configA.customFields.map((f: any) => f.name).join(", ")}
            valueB={configB.customFields.map((f: any) => f.name).join(", ")}
          />
        </tbody>
      </table>
    </div>
  );
}
