"use client";

import { TenantForm } from "@/components/TenantForm";

export default function NewTenantPage() {
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">New Tenant</h1>
      <TenantForm onSubmit={async () => {}} />
    </div>
  );
}
