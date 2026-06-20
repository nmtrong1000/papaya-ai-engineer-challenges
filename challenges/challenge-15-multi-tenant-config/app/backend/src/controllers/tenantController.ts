import type { Request, Response, NextFunction } from "express";
import { TenantConfigSchema, ErrorCode, ErrorMessage } from "@mtc/shared";
import { tenantService } from "../services/tenantService";

export const tenantController = {
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tenants = await tenantService.listTenants();
      res.json({ data: tenants });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant = await tenantService.getTenantById(req.params.id);
      res.json({ data: tenant });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug, ...rest } = req.body;
      if (!slug) {
        return res.status(400).json({ error: { code: ErrorCode.MISSING_SLUG, message: ErrorMessage.MISSING_SLUG } });
      }
      const parsed = TenantConfigSchema.safeParse(rest);
      if (!parsed.success) {
        return res.status(400).json({ error: { code: ErrorCode.VALIDATION_ERROR, message: ErrorMessage.VALIDATION_ERROR, details: parsed.error.flatten() } });
      }
      const tenant = await tenantService.createTenant(slug, parsed.data);
      res.status(201).json({ data: tenant });
    } catch (err: any) {
      if (err?.code === "P2002") {
        return res.status(409).json({ error: { code: ErrorCode.SLUG_CONFLICT, message: ErrorMessage.SLUG_CONFLICT } });
      }
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = TenantConfigSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: { code: ErrorCode.VALIDATION_ERROR, message: ErrorMessage.VALIDATION_ERROR, details: parsed.error.flatten() } });
      }
      const tenant = await tenantService.updateTenant(req.params.id, parsed.data);
      res.json({ data: tenant });
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
