import type { Request, Response, NextFunction } from "express";
import { TenantConfigSchema } from "@mtc/shared";
import { tenantService } from "../services/tenantService";

export const tenantController = {
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tenants = await tenantService.listTenants();
      res.json(tenants);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant = await tenantService.getTenantById(req.params.id);
      res.json(tenant);
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug, ...rest } = req.body;
      if (!slug) {
        return res.status(400).json({ message: "slug is required" });
      }
      const parsed = TenantConfigSchema.safeParse(rest);
      if (!parsed.success) {
        return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
      }
      const tenant = await tenantService.createTenant(slug, parsed.data);
      res.status(201).json(tenant);
    } catch (err: any) {
      if (err?.code === "P2002") {
        return res.status(409).json({ message: "Slug already in use" });
      }
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = TenantConfigSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
      }
      const tenant = await tenantService.updateTenant(req.params.id, parsed.data);
      res.json(tenant);
    } catch (err) {
      next(err);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await tenantService.deleteTenant(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
