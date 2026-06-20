import { Router } from "express";
import { tenantController } from "../controllers/tenantController";

const router = Router();

router.get("/", tenantController.list);
router.post("/", tenantController.create);
router.get("/:id", tenantController.getById);
router.put("/:id", tenantController.update);
router.delete("/:id", tenantController.remove);

export default router;
