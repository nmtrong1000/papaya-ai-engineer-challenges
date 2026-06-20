import { useFormContext } from "react-hook-form";
import { TenantConfigSchema } from "@/lib/shared";
import type { z } from "zod";

type FormValues = z.input<typeof TenantConfigSchema>;

export function BrandingSection() {
  const { register, formState: { errors } } = useFormContext<FormValues>();

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Branding</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("branding.name")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.branding?.name && (
            <p className="mt-1 text-xs text-red-600">{errors.branding.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
          <input
            {...register("branding.logoUrl")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.branding?.logoUrl && (
            <p className="mt-1 text-xs text-red-600">{errors.branding.logoUrl.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
          <input
            type="color"
            {...register("branding.primaryColor")}
            className="h-9 w-full rounded-md border border-gray-300 px-1 py-1 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
          <input
            type="color"
            {...register("branding.secondaryColor")}
            className="h-9 w-full rounded-md border border-gray-300 px-1 py-1 cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
}
