import type { Request, Response, NextFunction } from "express";
import { versionService } from "../services/versionService";

export const versionController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const versions = await versionService.listVersions(req.params.id);
      res.json(versions);
    } catch (err) {
      next(err);
    }
  },

  rollback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const version = parseInt(req.params.version, 10);
      if (isNaN(version)) {
        return res.status(400).json({ message: "version must be an integer" });
      }
      const result = await versionService.rollback(req.params.id, version);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
