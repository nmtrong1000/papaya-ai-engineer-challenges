import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { seedTestTenant, cleanupTestTenant, minimalConfig } from "../helpers/testHelpers";

const SLUG = `test-versions-${Date.now()}`;
let tenantId: string;

beforeAll(async () => {
  tenantId = await seedTestTenant(SLUG);
  // Create a second version via PUT
  const updated = { ...minimalConfig, branding: { ...minimalConfig.branding, name: "Version 2" } };
  await request(app).put(`/tenants/${tenantId}`).send(updated);
});

afterAll(async () => {
  await cleanupTestTenant(tenantId);
});

describe("GET /tenants/:id/versions", () => {
  it("returns version list ordered newest first", async () => {
    const res = await request(app).get(`/tenants/${tenantId}/versions`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    expect(res.body.data[0].version).toBeGreaterThan(res.body.data[1].version);
  });

  it("returns 404 for unknown tenant", async () => {
    const res = await request(app).get("/tenants/nonexistent-id/versions");
    expect(res.status).toBe(404);
  });
});

describe("GET /tenants/:id/versions/:version", () => {
  it("returns snapshot config for a valid version", async () => {
    const res = await request(app).get(`/tenants/${tenantId}/versions/1`);
    expect(res.status).toBe(200);
    expect(res.body.data.version).toBe(1);
    expect(res.body.data.config).toBeDefined();
    expect(res.body.data.config.branding.name).toBe("Test Tenant");
  });

  it("returns 404 for a non-existent version number", async () => {
    const res = await request(app).get(`/tenants/${tenantId}/versions/9999`);
    expect(res.status).toBe(404);
  });
});

describe("POST /tenants/:id/rollback/:version", () => {
  it("rolls back to version 1 and creates a new version", async () => {
    const listBefore = await request(app).get(`/tenants/${tenantId}/versions`);
    const countBefore = listBefore.body.data.length;

    const res = await request(app).post(`/tenants/${tenantId}/rollback/1`);
    expect(res.status).toBe(200);
    expect(res.body.data.newVersion).toBeGreaterThan(countBefore);

    const tenant = await request(app).get(`/tenants/${tenantId}`);
    expect(tenant.body.data.branding.name).toBe("Test Tenant");
  });

  it("returns 400 for a non-integer version", async () => {
    const res = await request(app).post(`/tenants/${tenantId}/rollback/abc`);
    expect(res.status).toBe(400);
  });

  it("returns 404 for unknown version number", async () => {
    const res = await request(app).post(`/tenants/${tenantId}/rollback/9999`);
    expect(res.status).toBe(404);
  });
});
