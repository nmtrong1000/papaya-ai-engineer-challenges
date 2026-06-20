-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "autoApprovalThreshold" INTEGER NOT NULL DEFAULT 0,
    "currentVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branding" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "primaryColor" TEXT NOT NULL DEFAULT '#000000',
    "secondaryColor" TEXT NOT NULL DEFAULT '#ffffff',

    CONSTRAINT "Branding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ClaimType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantClaimType" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "claimTypeId" TEXT NOT NULL,
    "requiredDocs" TEXT[],
    "optionalDocs" TEXT[],
    "slaDays" INTEGER NOT NULL DEFAULT 5,
    "escalateTo" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "TenantClaimType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantNotification" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "channels" TEXT[],
    "emailTemplate" TEXT,

    CONSTRAINT "TenantNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalTier" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "minAmount" INTEGER NOT NULL,
    "maxAmount" INTEGER,
    "approverRole" TEXT NOT NULL,
    "tierOrder" INTEGER NOT NULL,

    CONSTRAINT "ApprovalTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomField" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fieldKey" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT[],
    "fieldOrder" INTEGER NOT NULL,

    CONSTRAINT "CustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantVersion" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,
    "config" JSONB NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenantVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Branding_tenantId_key" ON "Branding"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimType_name_key" ON "ClaimType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TenantNotification_tenantId_event_key" ON "TenantNotification"("tenantId", "event");

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "TenantVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branding" ADD CONSTRAINT "Branding_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantClaimType" ADD CONSTRAINT "TenantClaimType_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantClaimType" ADD CONSTRAINT "TenantClaimType_claimTypeId_fkey" FOREIGN KEY ("claimTypeId") REFERENCES "ClaimType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantNotification" ADD CONSTRAINT "TenantNotification_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalTier" ADD CONSTRAINT "ApprovalTier_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomField" ADD CONSTRAINT "CustomField_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantVersion" ADD CONSTRAINT "TenantVersion_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
