"use client";

import { useForm, FormProvider } from "react-hook-form";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TenantConfigSchema } from "@mtc/shared";
import type { TenantConfig } from "@mtc/shared";
import type { z } from "zod";
import { BrandingSection } from "@/components/TenantForm/BrandingSection";
import { ClaimTypesSection } from "@/components/TenantForm/ClaimTypesSection";
import { ApprovalRulesSection } from "@/components/TenantForm/ApprovalRulesSection";
import { NotificationsSection } from "@/components/TenantForm/NotificationsSection";
import { CustomFieldsSection } from "@/components/TenantForm/CustomFieldsSection";

type FormValues = z.input<typeof TenantConfigSchema>;

type Props = {
  defaultValues?: Partial<TenantConfig>;
  slug?: string;
  isEditMode?: boolean;
  onSubmit?: (data: TenantConfig, slug: string) => Promise<void>;
  error?: string | null;
  extraSections?: React.ReactNode;
  readOnly?: boolean;
};

const emptyDefaults: FormValues = {
  branding: { name: "", logoUrl: "", primaryColor: "#000000", secondaryColor: "#ffffff" },
  autoApprovalThreshold: 0,
  claimTypes: [],
  approvalTiers: [],
  notifications: [],
  customFields: [],
};

export function TenantForm({ defaultValues, slug: initialSlug = "", isEditMode = false, onSubmit, error, extraSections, readOnly = false }: Props) {
  const methods = useForm<FormValues>({
    resolver: zodResolver(TenantConfigSchema),
    defaultValues: { ...emptyDefaults, ...defaultValues },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;
  const slugRef = useRef(initialSlug);

  return (
    <FormProvider {...methods}>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <form
        onSubmit={readOnly || !onSubmit
          ? (e) => e.preventDefault()
          : handleSubmit((data) => onSubmit(data as unknown as TenantConfig, slugRef.current))}
        className="space-y-8"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug {!readOnly && <span className="text-red-500">*</span>}
          </label>
          {isEditMode || readOnly ? (
            <p className="text-sm text-gray-500 font-mono bg-gray-50 border border-gray-200 rounded-md px-3 py-2">{initialSlug}</p>
          ) : (
            <input
              name="slug"
              defaultValue={initialSlug}
              pattern="[a-z0-9-]+"
              placeholder="e.g. acme-insurance"
              onChange={(e) => { slugRef.current = e.target.value; }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {!readOnly && <p className="mt-1 text-xs text-gray-400">Lowercase letters, numbers, and hyphens only. Cannot be changed after creation.</p>}
        </div>

        <fieldset disabled={readOnly} className="space-y-8 border-0 p-0 m-0 min-w-0">
          <BrandingSection />
          <ClaimTypesSection />
          <ApprovalRulesSection />
          <NotificationsSection />
          <CustomFieldsSection />
          {extraSections}
        </fieldset>

        {!readOnly && (
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

