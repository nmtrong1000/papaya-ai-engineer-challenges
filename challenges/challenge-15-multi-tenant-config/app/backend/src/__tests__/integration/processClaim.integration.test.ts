import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { seedTestTenant, cleanupTestTenant } from "../helpers/testHelpers";

const SLUG = `test-claim-${Date.now()}`;
let tenantId: string;

beforeAll(async () => {
  tenantId = await seedTestTenant(SLUG);
});

afterAll(async () => {
  await cleanupTestTenant(tenantId);
});

describe("POST /tenants/:id/process-claim", () => {
  const today = new Date().toISOString().slice(0, 10);

  it("returns claim result for a valid claim below auto-approval threshold", async () => {
    const res = await request(app)
      .post(`/tenants/${tenantId}/process-claim`)
      .send({ claimType: "OUTPATIENT", amount: 1000, submissionDate: today });
    expect(res.status).toBe(200);
    expect(res.body.data.autoApproved).toBe(true);
    expect(res.body.data.slaDueDate).toBeDefined();
  });

  it("returns claim result with approval tier for amount above threshold", async () => {
    const res = await request(app)
      .post(`/tenants/${tenantId}/process-claim`)
      .send({ claimType: "OUTPATIENT", amount: 10000, submissionDate: today });
    expect(res.status).toBe(200);
    expect(res.body.data.autoApproved).toBe(false);
    expect(res.body.data.approvalTier).toBeDefined();
    expect(res.body.data.approvalTier.approverRole).toBe("assessor");
  });

  it("returns 400 for a disabled claim type", async () => {
    const res = await request(app)
      .post(`/tenants/${tenantId}/process-claim`)
      .send({ claimType: "DENTAL", amount: 5000, submissionDate: today });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("returns 400 for missing required fields", async () => {
    const res = await request(app)
      .post(`/tenants/${tenantId}/process-claim`)
      .send({ claimType: "OUTPATIENT" });
    expect(res.status).toBe(400);
  });

  it("returns 404 for unknown tenant", async () => {
    const res = await request(app)
      .post("/tenants/nonexistent-id/process-claim")
      .send({ claimType: "OUTPATIENT", amount: 1000, submissionDate: today });
    expect(res.status).toBe(404);
  });
});
