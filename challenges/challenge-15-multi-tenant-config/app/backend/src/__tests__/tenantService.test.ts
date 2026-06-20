import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../repositories/tenantRepository", () => ({
  tenantRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    upsertBranding: vi.fn(),
    updateAutoApprovalThreshold: vi.fn(),
    replaceApprovalTiers: vi.fn(),
    replaceTenantClaimTypes: vi.fn(),
    replaceNotifications: vi.fn(),
    replaceCustomFields: vi.fn(),
    getNextVersionNumber: vi.fn().mockResolvedValue(1),
    createVersion: vi.fn().mockResolvedValue({ id: "ver-1" }),
    updateCurrentVersionId: vi.fn(),
  },
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(async (fn: any) => fn({})),
  },
}));

vi.mock("../lib/configCache", () => ({
  configCache: {
    get: vi.fn(),
    set: vi.fn(),
    invalidate: vi.fn(),
  },
}));

import { tenantService } from "../services/tenantService";
import { tenantRepository } from "../repositories/tenantRepository";
import { configCache } from "../lib/configCache";

const mockRepo = tenantRepository as any;
const mockCache = configCache as any;

const fakeTenant = {
  id: "tenant-1",
  slug: "test",
  autoApprovalThreshold: 0,
  currentVersionId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  branding: { name: "Test", logoUrl: "", primaryColor: "#000", secondaryColor: "#fff" },
  claimTypes: [],
  approvalTiers: [],
  notifications: [],
  customFields: [],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("tenantService.listTenants", () => {
  it("delegates to repository findAll", async () => {
    mockRepo.findAll.mockResolvedValue([fakeTenant]);
    const result = await tenantService.listTenants();
    expect(mockRepo.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual([fakeTenant]);
  });
});

describe("tenantService.getTenantById", () => {
  it("returns tenant when found", async () => {
    mockRepo.findById.mockResolvedValue(fakeTenant);
    const result = await tenantService.getTenantById("tenant-1");
    expect(result).toEqual(fakeTenant);
  });

  it("throws 404 when tenant not found", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(tenantService.getTenantById("missing")).rejects.toMatchObject({ status: 404 });
  });
});

describe("tenantService.deleteTenant", () => {
  it("calls repository delete and invalidates cache", async () => {
    mockRepo.findById.mockResolvedValue(fakeTenant);
    mockRepo.delete.mockResolvedValue(undefined);

    await tenantService.deleteTenant("tenant-1");

    expect(mockRepo.delete).toHaveBeenCalledWith("tenant-1");
    expect(mockCache.invalidate).toHaveBeenCalledWith("tenant-1");
  });

  it("throws 404 if tenant does not exist", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(tenantService.deleteTenant("missing")).rejects.toMatchObject({ status: 404 });
  });
});

const minimalConfig = {
  branding: { name: "T", logoUrl: "", primaryColor: "#000", secondaryColor: "#fff" },
  autoApprovalThreshold: 0,
  claimTypes: [],
  approvalTiers: [],
  notifications: [],
  customFields: [],
} as any;

describe("tenantService.createTenant", () => {
  it("creates tenant and saves config", async () => {
    mockRepo.create.mockResolvedValue({ id: "tenant-new" });
    mockRepo.findById.mockResolvedValue({ ...fakeTenant, id: "tenant-new" });

    const result = await tenantService.createTenant("new-slug", minimalConfig);

    expect(mockRepo.create).toHaveBeenCalledWith("new-slug", {});
    expect(mockRepo.upsertBranding).toHaveBeenCalled();
    expect(mockRepo.createVersion).toHaveBeenCalled();
    expect(result?.id).toBe("tenant-new");
  });
});

describe("tenantService.updateTenant", () => {
  it("updates config and returns tenant", async () => {
    mockRepo.findById.mockResolvedValue(fakeTenant);

    const _result = await tenantService.updateTenant("tenant-1", minimalConfig);

    expect(mockRepo.upsertBranding).toHaveBeenCalled();
    expect(mockRepo.updateCurrentVersionId).toHaveBeenCalled();
    expect(mockCache.invalidate).toHaveBeenCalledWith("tenant-1");
  });

  it("throws 404 if tenant does not exist", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(tenantService.updateTenant("missing", minimalConfig)).rejects.toMatchObject({ status: 404 });
  });
});
