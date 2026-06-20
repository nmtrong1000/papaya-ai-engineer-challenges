import type { Request, Response, NextFunction } from "express";
import { versionService } from "../services/versionService";
import { ErrorCode, ErrorMessage } from "@mtc/shared";

export const versionController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const versions = await versionService.listVersions(req.params.id);
      res.json({ data: versions });
    } catch (err) {
      next(err);
    }
  },

  rollback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const version = parseInt(req.params.version, 10);
      if (isNaN(version)) {
        return res.status(400).json({ error: { code: ErrorCode.INVALID_VERSION, message: ErrorMessage.INVALID_VERSION } });
      }
      const result = await versionService.rollback(req.params.id, version);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  },
};
