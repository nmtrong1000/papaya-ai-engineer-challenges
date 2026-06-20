import { Router } from "express";
import { claimController } from "../controllers/claimController";

const router = Router({ mergeParams: true });

router.post("/:id/process-claim", claimController.processClaim);

export default router;
