import { Router } from "express";
import { getJobs , createJob } from "../controllers/job.controller.js"
import { verifyToken } from "../middleWares/isSignedIn.js";


const router = Router();



router.get("/" ,verifyToken, getJobs);
router.post("/" , verifyToken, createJob);


export default router;