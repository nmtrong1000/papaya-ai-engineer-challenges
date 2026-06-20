import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Delete in FK-safe order
  await prisma.tenantVersion.deleteMany();
  await prisma.customField.deleteMany();
  await prisma.tenantNotification.deleteMany();
  await prisma.approvalTier.deleteMany();
  await prisma.tenantClaimType.deleteMany();
  await prisma.branding.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.claimType.deleteMany();

  // Upsert 5 global ClaimType rows
  const claimTypeNames = ["OUTPATIENT", "INPATIENT", "DENTAL", "MATERNITY", "OPTICAL"];
  for (const name of claimTypeNames) {
    await prisma.claimType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const ct = await prisma.claimType.findMany();
  const ctMap = Object.fromEntries(ct.map((c) => [c.name, c.id]));

  const ALL_EVENTS = ["claim_submitted", "approved", "rejected", "payment_sent"];

  // ── SafeGuard Insurance ──────────────────────────────────────────────────
  await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: { slug: "safeguard-insurance", autoApprovalThreshold: 20000 },
    });

    await tx.branding.create({
      data: {
        tenantId: tenant.id,
        name: "SafeGuard Insurance",
        logoUrl: "",
        primaryColor: "#1D4ED8",
        secondaryColor: "#93C5FD",
      },
    });

    await tx.tenantClaimType.createMany({
      data: [
        { tenantId: tenant.id, claimTypeId: ctMap["OUTPATIENT"], requiredDocs: ["medical_receipt", "diagnosis_note"], optionalDocs: ["referral_letter", "lab_results"], slaDays: 5, escalateTo: "claims_manager" },
        { tenantId: tenant.id, claimTypeId: ctMap["INPATIENT"],  requiredDocs: ["admission_record", "discharge_summary", "itemized_bill", "doctors_report"], optionalDocs: ["lab_results"], slaDays: 10, escalateTo: "director" },
        { tenantId: tenant.id, claimTypeId: ctMap["DENTAL"],     requiredDocs: ["dental_receipt", "treatment_plan"], optionalDocs: ["xray_images"], slaDays: 5, escalateTo: "claims_manager" },
      ],
    });

    await tx.approvalTier.createMany({
      data: [
        { tenantId: tenant.id, minAmount: 20000,  maxAmount: 100000,  approverRole: "assessor",  tierOrder: 1 },
        { tenantId: tenant.id, minAmount: 100000, maxAmount: 500000,  approverRole: "team_lead", tierOrder: 2 },
        { tenantId: tenant.id, minAmount: 500000, maxAmount: null,    approverRole: "director",  tierOrder: 3 },
      ],
    });

    await tx.tenantNotification.createMany({
      data: ALL_EVENTS.map((event) => ({ tenantId: tenant.id, event, channels: ["email"], emailTemplate: null })),
    });

    await tx.customField.createMany({
      data: [
        { tenantId: tenant.id, name: "Employee ID", fieldKey: "employee_id", fieldType: "text", required: true, options: [], fieldOrder: 1 },
      ],
    });

    const config = buildConfig({
      schemaVersion: 1,
      branding: { name: "SafeGuard Insurance", logoUrl: "", primaryColor: "#1D4ED8", secondaryColor: "#93C5FD" },
      autoApprovalThreshold: 20000,
      approvalTiers: [
        { minAmount: 20000, maxAmount: 100000, approverRole: "assessor", tierOrder: 1 },
        { minAmount: 100000, maxAmount: 500000, approverRole: "team_lead", tierOrder: 2 },
        { minAmount: 500000, maxAmount: null, approverRole: "director", tierOrder: 3 },
      ],
      claimTypes: [
        { type: "OUTPATIENT", requiredDocs: ["medical_receipt", "diagnosis_note"], optionalDocs: ["referral_letter", "lab_results"], slaDays: 5, escalateTo: "claims_manager" },
        { type: "INPATIENT",  requiredDocs: ["admission_record", "discharge_summary", "itemized_bill", "doctors_report"], optionalDocs: ["lab_results"], slaDays: 10, escalateTo: "director" },
        { type: "DENTAL",     requiredDocs: ["dental_receipt", "treatment_plan"], optionalDocs: ["xray_images"], slaDays: 5, escalateTo: "claims_manager" },
      ],
      notifications: ALL_EVENTS.map((event) => ({ event, channels: ["email"], emailTemplate: null })),
      customFields: [
        { name: "Employee ID", fieldKey: "employee_id", type: "text", required: true, options: [], fieldOrder: 1 },
      ],
    });

    const version = await tx.tenantVersion.create({
      data: { tenantId: tenant.id, version: 1, schemaVersion: 1, config, note: "Initial seed" },
    });

    await tx.tenant.update({ where: { id: tenant.id }, data: { currentVersionId: version.id } });
  });

  // ── HealthFirst ──────────────────────────────────────────────────────────
  await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: { slug: "healthfirst", autoApprovalThreshold: 50000 },
    });

    await tx.branding.create({
      data: {
        tenantId: tenant.id,
        name: "HealthFirst",
        logoUrl: "",
        primaryColor: "#059669",
        secondaryColor: "#6EE7B7",
      },
    });

    await tx.tenantClaimType.createMany({
      data: [
        { tenantId: tenant.id, claimTypeId: ctMap["OUTPATIENT"], requiredDocs: ["medical_receipt", "diagnosis_note"], optionalDocs: ["referral_letter"], slaDays: 7, escalateTo: "claims_manager" },
        { tenantId: tenant.id, claimTypeId: ctMap["INPATIENT"],  requiredDocs: ["admission_record", "discharge_summary", "itemized_bill"], optionalDocs: ["lab_results", "doctors_report"], slaDays: 14, escalateTo: "manager" },
        { tenantId: tenant.id, claimTypeId: ctMap["DENTAL"],     requiredDocs: ["dental_receipt", "treatment_plan"], optionalDocs: ["xray_images"], slaDays: 7, escalateTo: "claims_manager" },
        { tenantId: tenant.id, claimTypeId: ctMap["MATERNITY"],  requiredDocs: ["maternity_certificate", "hospital_bill", "doctors_report"], optionalDocs: ["scan_reports"], slaDays: 21, escalateTo: "director" },
      ],
    });

    await tx.approvalTier.createMany({
      data: [
        { tenantId: tenant.id, minAmount: 50000,  maxAmount: 200000,  approverRole: "senior_assessor", tierOrder: 1 },
        { tenantId: tenant.id, minAmount: 200000, maxAmount: 1000000, approverRole: "manager",         tierOrder: 2 },
        { tenantId: tenant.id, minAmount: 1000000, maxAmount: null,   approverRole: "director",        tierOrder: 3 },
      ],
    });

    await tx.tenantNotification.createMany({
      data: ALL_EVENTS.map((event) => ({ tenantId: tenant.id, event, channels: ["email", "sms"], emailTemplate: null })),
    });

    await tx.customField.createMany({
      data: [
        { tenantId: tenant.id, name: "Employee ID",    fieldKey: "employee_id",    fieldType: "text", required: true, options: [], fieldOrder: 1 },
        { tenantId: tenant.id, name: "Policy Number",  fieldKey: "policy_number",  fieldType: "text", required: true, options: [], fieldOrder: 2 },
      ],
    });

    const config = buildConfig({
      schemaVersion: 1,
      branding: { name: "HealthFirst", logoUrl: "", primaryColor: "#059669", secondaryColor: "#6EE7B7" },
      autoApprovalThreshold: 50000,
      approvalTiers: [
        { minAmount: 50000, maxAmount: 200000, approverRole: "senior_assessor", tierOrder: 1 },
        { minAmount: 200000, maxAmount: 1000000, approverRole: "manager", tierOrder: 2 },
        { minAmount: 1000000, maxAmount: null, approverRole: "director", tierOrder: 3 },
      ],
      claimTypes: [
        { type: "OUTPATIENT", requiredDocs: ["medical_receipt", "diagnosis_note"], optionalDocs: ["referral_letter"], slaDays: 7, escalateTo: "claims_manager" },
        { type: "INPATIENT",  requiredDocs: ["admission_record", "discharge_summary", "itemized_bill"], optionalDocs: ["lab_results", "doctors_report"], slaDays: 14, escalateTo: "manager" },
        { type: "DENTAL",     requiredDocs: ["dental_receipt", "treatment_plan"], optionalDocs: ["xray_images"], slaDays: 7, escalateTo: "claims_manager" },
        { type: "MATERNITY",  requiredDocs: ["maternity_certificate", "hospital_bill", "doctors_report"], optionalDocs: ["scan_reports"], slaDays: 21, escalateTo: "director" },
      ],
      notifications: ALL_EVENTS.map((event) => ({ event, channels: ["email", "sms"], emailTemplate: null })),
      customFields: [
        { name: "Employee ID",   fieldKey: "employee_id",   type: "text", required: true, options: [], fieldOrder: 1 },
        { name: "Policy Number", fieldKey: "policy_number", type: "text", required: true, options: [], fieldOrder: 2 },
      ],
    });

    const version = await tx.tenantVersion.create({
      data: { tenantId: tenant.id, version: 1, schemaVersion: 1, config, note: "Initial seed" },
    });

    await tx.tenant.update({ where: { id: tenant.id }, data: { currentVersionId: version.id } });
  });

  // ── GovHealth ────────────────────────────────────────────────────────────
  await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: { slug: "govhealth", autoApprovalThreshold: 0 },
    });

    await tx.branding.create({
      data: {
        tenantId: tenant.id,
        name: "GovHealth",
        logoUrl: "",
        primaryColor: "#7C3AED",
        secondaryColor: "#C4B5FD",
      },
    });

    await tx.tenantClaimType.createMany({
      data: [
        { tenantId: tenant.id, claimTypeId: ctMap["OUTPATIENT"], requiredDocs: ["medical_receipt", "diagnosis_note", "national_id"], optionalDocs: ["referral_letter"], slaDays: 15, escalateTo: "supervisor" },
        { tenantId: tenant.id, claimTypeId: ctMap["INPATIENT"],  requiredDocs: ["admission_record", "discharge_summary", "itemized_bill", "doctors_report", "national_id"], optionalDocs: ["lab_results"], slaDays: 20, escalateTo: "director" },
        { tenantId: tenant.id, claimTypeId: ctMap["DENTAL"],     requiredDocs: ["dental_receipt", "treatment_plan", "national_id"], optionalDocs: ["xray_images"], slaDays: 15, escalateTo: "supervisor" },
        { tenantId: tenant.id, claimTypeId: ctMap["MATERNITY"],  requiredDocs: ["maternity_certificate", "hospital_bill", "doctors_report", "national_id"], optionalDocs: ["scan_reports"], slaDays: 25, escalateTo: "director" },
        { tenantId: tenant.id, claimTypeId: ctMap["OPTICAL"],    requiredDocs: ["optical_receipt", "prescription", "national_id"], optionalDocs: [], slaDays: 25, escalateTo: "supervisor" },
      ],
    });

    await tx.approvalTier.createMany({
      data: [
        { tenantId: tenant.id, minAmount: 0,       maxAmount: 100000,  approverRole: "officer",   tierOrder: 1 },
        { tenantId: tenant.id, minAmount: 100000,  maxAmount: 500000,  approverRole: "supervisor", tierOrder: 2 },
        { tenantId: tenant.id, minAmount: 500000,  maxAmount: 2000000, approverRole: "director",  tierOrder: 3 },
        { tenantId: tenant.id, minAmount: 2000000, maxAmount: null,    approverRole: "committee", tierOrder: 4 },
      ],
    });

    await tx.tenantNotification.createMany({
      data: ALL_EVENTS.map((event) => ({ tenantId: tenant.id, event, channels: ["email", "sms", "webhook"], emailTemplate: null })),
    });

    await tx.customField.createMany({
      data: [
        { tenantId: tenant.id, name: "National ID",       fieldKey: "national_id",       fieldType: "text",   required: true, options: [], fieldOrder: 1 },
        { tenantId: tenant.id, name: "Department",        fieldKey: "department",         fieldType: "text",   required: true, options: [], fieldOrder: 2 },
        { tenantId: tenant.id, name: "Employment Type",   fieldKey: "employment_type",    fieldType: "select", required: true, options: ["full-time", "part-time", "contract"], fieldOrder: 3 },
      ],
    });

    const config = buildConfig({
      schemaVersion: 1,
      branding: { name: "GovHealth", logoUrl: "", primaryColor: "#7C3AED", secondaryColor: "#C4B5FD" },
      autoApprovalThreshold: 0,
      approvalTiers: [
        { minAmount: 0, maxAmount: 100000, approverRole: "officer", tierOrder: 1 },
        { minAmount: 100000, maxAmount: 500000, approverRole: "supervisor", tierOrder: 2 },
        { minAmount: 500000, maxAmount: 2000000, approverRole: "director", tierOrder: 3 },
        { minAmount: 2000000, maxAmount: null, approverRole: "committee", tierOrder: 4 },
      ],
      claimTypes: [
        { type: "OUTPATIENT", requiredDocs: ["medical_receipt", "diagnosis_note", "national_id"], optionalDocs: ["referral_letter"], slaDays: 15, escalateTo: "supervisor" },
        { type: "INPATIENT",  requiredDocs: ["admission_record", "discharge_summary", "itemized_bill", "doctors_report", "national_id"], optionalDocs: ["lab_results"], slaDays: 20, escalateTo: "director" },
        { type: "DENTAL",     requiredDocs: ["dental_receipt", "treatment_plan", "national_id"], optionalDocs: ["xray_images"], slaDays: 15, escalateTo: "supervisor" },
        { type: "MATERNITY",  requiredDocs: ["maternity_certificate", "hospital_bill", "doctors_report", "national_id"], optionalDocs: ["scan_reports"], slaDays: 25, escalateTo: "director" },
        { type: "OPTICAL",    requiredDocs: ["optical_receipt", "prescription", "national_id"], optionalDocs: [], slaDays: 25, escalateTo: "supervisor" },
      ],
      notifications: ALL_EVENTS.map((event) => ({ event, channels: ["email", "sms", "webhook"], emailTemplate: null })),
      customFields: [
        { name: "National ID",     fieldKey: "national_id",    type: "text",   required: true, options: [], fieldOrder: 1 },
        { name: "Department",      fieldKey: "department",     type: "text",   required: true, options: [], fieldOrder: 2 },
        { name: "Employment Type", fieldKey: "employment_type", type: "select", required: true, options: ["full-time", "part-time", "contract"], fieldOrder: 3 },
      ],
    });

    const version = await tx.tenantVersion.create({
      data: { tenantId: tenant.id, version: 1, schemaVersion: 1, config, note: "Initial seed" },
    });

    await tx.tenant.update({ where: { id: tenant.id }, data: { currentVersionId: version.id } });
  });

  console.log("Seeded: SafeGuard Insurance, HealthFirst, GovHealth");
}

function buildConfig(data: object): object {
  return data;
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
