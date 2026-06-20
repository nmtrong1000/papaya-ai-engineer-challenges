"use client";

import { useForm, FormProvider } from "react-hook-form";
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
  onSubmit: (data: TenantConfig) => Promise<void>;
  extraSections?: React.ReactNode;
};

const emptyDefaults: FormValues = {
  branding: { name: "", logoUrl: "", primaryColor: "#000000", secondaryColor: "#ffffff" },
  autoApprovalThreshold: 0,
  claimTypes: [],
  approvalTiers: [],
  notifications: [],
  customFields: [],
};

export function TenantForm({ defaultValues, onSubmit, extraSections }: Props) {
  const methods = useForm<FormValues>({
    resolver: zodResolver(TenantConfigSchema),
    defaultValues: { ...emptyDefaults, ...defaultValues },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as TenantConfig))} className="space-y-8">
        <BrandingSection />
        <ClaimTypesSection />
        <ApprovalRulesSection />
        <NotificationsSection />
        <CustomFieldsSection />
        {extraSections}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
