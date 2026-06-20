import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { seedTestTenant, cleanupTestTenant, minimalConfig } from "../helpers/testHelpers";

const SLUG = `test-tenants-${Date.now()}`;
let tenantId: string;

beforeAll(async () => {
  tenantId = await seedTestTenant(SLUG);
});

afterAll(async () => {
  await cleanupTestTenant(tenantId);
});

describe("GET /tenants", () => {
  it("returns 200 with a list including the seeded tenant", async () => {
    const res = await request(app).get("/tenants");
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.some((t: any) => t.id === tenantId)).toBe(true);
  });
});

describe("GET /tenants/:id", () => {
  it("returns full config for a valid id", async () => {
    const res = await request(app).get(`/tenants/${tenantId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(tenantId);
    expect(res.body.data.slug).toBe(SLUG);
    expect(res.body.data.branding.name).toBe("Test Tenant");
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).get("/tenants/nonexistent-id");
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

describe("POST /tenants", () => {
  const newSlug = `test-create-${Date.now()}`;
  let createdId: string;

  afterAll(async () => {
    if (createdId) await cleanupTestTenant(createdId);
  });

  it("creates a tenant and returns 201", async () => {
    const res = await request(app)
      .post("/tenants")
      .send({ slug: newSlug, ...minimalConfig });
    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe(newSlug);
    createdId = res.body.data.id;
  });

  it("returns 409 on duplicate slug", async () => {
    const res = await request(app)
      .post("/tenants")
      .send({ slug: SLUG, ...minimalConfig });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("SLUG_CONFLICT");
  });

  it("returns 400 when slug is missing", async () => {
    const res = await request(app)
      .post("/tenants")
      .send({ ...minimalConfig });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("MISSING_SLUG");
  });
});

describe("PUT /tenants/:id", () => {
  it("updates config and returns updated tenant", async () => {
    const updated = { ...minimalConfig, branding: { ...minimalConfig.branding, name: "Updated Name" } };
    const res = await request(app)
      .put(`/tenants/${tenantId}`)
      .send(updated);
    expect(res.status).toBe(200);
    expect(res.body.data.branding.name).toBe("Updated Name");
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app)
      .put("/tenants/nonexistent-id")
      .send(minimalConfig);
    expect(res.status).toBe(404);
  });
});

describe("DELETE /tenants/:id", () => {
  it("deletes a tenant and returns 204", async () => {
    const id = await seedTestTenant(`test-delete-${Date.now()}`);
    const res = await request(app).delete(`/tenants/${id}`);
    expect(res.status).toBe(204);

    const check = await request(app).get(`/tenants/${id}`);
    expect(check.status).toBe(404);
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).delete("/tenants/nonexistent-id");
    expect(res.status).toBe(404);
  });
});
