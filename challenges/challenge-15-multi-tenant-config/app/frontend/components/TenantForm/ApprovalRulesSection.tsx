import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { TenantConfigSchema } from "@/lib/shared";
import { APPROVER_ROLES } from "@/lib/constants";
import type { z } from "zod";

type FormValues = z.input<typeof TenantConfigSchema>;


export function ApprovalRulesSection() {
  const { register, control, formState: { errors } } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "approvalTiers" });

  const tierErrors = (errors.approvalTiers as any) ?? [];

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Approval Rules</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Auto-Approval Threshold <span className="text-red-500">*</span>
        </label>
        <div className="relative w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            type="number"
            min={0}
            {...register("autoApprovalThreshold", { valueAsNumber: true })}
            className="w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {errors.autoApprovalThreshold && (
          <p className="mt-1 text-xs text-red-600">{(errors.autoApprovalThreshold as any).message}</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Approval Tiers</p>
        {fields.length === 0 && (
          <p className="text-xs text-gray-400">No tiers configured — all claims above threshold will be unassigned.</p>
        )}
        {fields.map((field, idx) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-start">
            <div>
              {idx === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Min Amount <span className="text-red-500">*</span></label>}
              <input
                type="number"
                min={0}
                placeholder="Min"
                {...register(`approvalTiers.${idx}.minAmount`, { valueAsNumber: true })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {tierErrors[idx]?.minAmount && <p className="mt-0.5 text-xs text-red-600">{tierErrors[idx].minAmount.message}</p>}
            </div>
            <div>
              {idx === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Max Amount</label>}
              <input
                type="number"
                min={0}
                placeholder="No limit"
                {...register(`approvalTiers.${idx}.maxAmount`, {
                  setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
                })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              {idx === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Approver Role <span className="text-red-500">*</span></label>}
              <Controller
                control={control}
                name={`approvalTiers.${idx}.approverRole`}
                render={({ field: f }) => (
                  <select
                    value={f.value}
                    onChange={f.onChange}
                    onBlur={f.onBlur}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select role…</option>
                    {APPROVER_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                )}
              />
              {tierErrors[idx]?.approverRole && <p className="mt-0.5 text-xs text-red-600">{tierErrors[idx].approverRole.message}</p>}
            </div>
            <div className={idx === 0 ? "pt-5" : ""}>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="px-2 py-2 text-red-500 hover:text-red-700 text-sm"
                aria-label="Remove tier"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ minAmount: 0, maxAmount: null, approverRole: "", tierOrder: fields.length + 1 })}
          className="mt-1 text-sm text-blue-600 hover:underline"
        >
          + Add Tier
        </button>
      </div>
    </section>
  );
}
