import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { TenantConfigSchema, ClaimTypeEnum } from "@mtc/shared";
import type { z } from "zod";
import { DocTagInput } from "@/components/TenantForm/DocTagInput";

type FormValues = z.input<typeof TenantConfigSchema>;

const ALL_TYPES = ClaimTypeEnum.options;
type ClaimType = (typeof ALL_TYPES)[number];

const ESCALATION_ROLES = [
  { value: "claims_manager",      label: "Claims Manager" },
  { value: "senior_claims_manager", label: "Senior Claims Manager" },
  { value: "supervisor",          label: "Supervisor" },
  { value: "manager",             label: "Manager" },
  { value: "director",            label: "Director" },
  { value: "compliance_officer",  label: "Compliance Officer" },
  { value: "medical_reviewer",    label: "Medical Reviewer" },
  { value: "underwriter",         label: "Underwriter" },
];

export function ClaimTypesSection() {
  const { register, control, watch, formState: { errors } } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "claimTypes" });

  const enabledTypes = watch("claimTypes").map((ct) => ct.type);

  const toggle = (type: ClaimType, checked: boolean) => {
    if (checked) {
      append({ type, requiredDocs: [], optionalDocs: [], slaDays: 5, escalateTo: "" });
    } else {
      const idx = fields.findIndex((f) => f.type === type);
      if (idx !== -1) remove(idx);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Claim Types</h2>
      <div className="space-y-4">
        {ALL_TYPES.map((type) => {
          const idx = fields.findIndex((f) => f.type === type);
          const enabled = idx !== -1;
          const errs = (errors.claimTypes as any)?.[idx];
          return (
            <div key={type} className="border border-gray-200 rounded-lg overflow-hidden">
              <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => toggle(type, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-800">{type}</span>
              </label>

              {enabled && (
                <div className="px-4 pb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-gray-100 pt-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Required Docs <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      control={control}
                      name={`claimTypes.${idx}.requiredDocs`}
                      render={({ field }) => (
                        <DocTagInput value={field.value as string[]} onChange={field.onChange} placeholder="Search required documents…" />
                      )}
                    />
                    {errs?.requiredDocs && <p className="mt-1 text-xs text-red-600">{errs.requiredDocs.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Optional Docs</label>
                    <Controller
                      control={control}
                      name={`claimTypes.${idx}.optionalDocs`}
                      render={({ field }) => (
                        <DocTagInput value={field.value as string[]} onChange={field.onChange} placeholder="Search optional documents…" />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      SLA Days <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register(`claimTypes.${idx}.slaDays`, { valueAsNumber: true })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errs?.slaDays && <p className="mt-1 text-xs text-red-600">{errs.slaDays.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Escalate To <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register(`claimTypes.${idx}.escalateTo`)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select role…</option>
                      {ESCALATION_ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                    {errs?.escalateTo && <p className="mt-1 text-xs text-red-600">{errs.escalateTo.message}</p>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
