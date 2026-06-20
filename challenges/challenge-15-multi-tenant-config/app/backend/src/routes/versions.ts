import { Router } from "express";
import { versionController } from "../controllers/versionController";

const router = Router({ mergeParams: true });

router.get("/:id/versions", versionController.list);
router.get("/:id/versions/:version", versionController.getVersion);
router.post("/:id/rollback/:version", versionController.rollback);

export default router;
