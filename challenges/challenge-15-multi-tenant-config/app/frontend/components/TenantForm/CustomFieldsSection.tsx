import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { TenantConfigSchema, CustomFieldTypeEnum } from "@mtc/shared";
import type { z } from "zod";

type FormValues = z.input<typeof TenantConfigSchema>;

const FIELD_TYPES = CustomFieldTypeEnum.options;

export function CustomFieldsSection() {
  const { register, control, watch, formState: { errors } } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "customFields" });

  const fieldErrors = (errors.customFields as any) ?? [];

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Custom Fields</h2>

      {fields.length === 0 && (
        <p className="text-xs text-gray-400">No custom fields configured.</p>
      )}

      <div className="space-y-3">
        {fields.map((field, idx) => {
          const fieldType = watch(`customFields.${idx}.type`);
          const errs = fieldErrors[idx] ?? {};
          return (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Field Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register(`customFields.${idx}.name`)}
                    placeholder="e.g. Employee ID"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errs.name && <p className="mt-0.5 text-xs text-red-600">{errs.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Field Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register(`customFields.${idx}.fieldKey`)}
                    placeholder="e.g. employee_id"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errs.fieldKey && <p className="mt-0.5 text-xs text-red-600">{errs.fieldKey.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register(`customFields.${idx}.type`)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700 pb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register(`customFields.${idx}.required`)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  Required
                </label>
              </div>

              {fieldType === "select" && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Options <span className="text-gray-400">(comma-separated)</span>
                  </label>
                  <Controller
                    control={control}
                    name={`customFields.${idx}.options`}
                    render={({ field: f }) => (
                      <input
                        value={Array.isArray(f.value) ? f.value.join(", ") : ""}
                        onChange={(e) =>
                          f.onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
                        }
                        placeholder="e.g. full_time, part_time, contract"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  />
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove field
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() =>
          append({ name: "", fieldKey: "", type: "text", required: false, options: [], fieldOrder: fields.length + 1 })
        }
        className="text-sm text-blue-600 hover:underline"
      >
        + Add Field
      </button>
    </section>
  );
}
