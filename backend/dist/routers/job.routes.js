import { Router } from "express";
import { getJobs, createJob } from "../controllers/job.controller.js";
const router = Router();
router.get("/", getJobs);
router.post("/", createJob);
export default router;
//# sourceMappingURL=job.routes.js.map