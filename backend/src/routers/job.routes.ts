import { Router } from "express";
import { getAllJobs , createJob , deleteJob , getJob , updateJob } from "../controllers/job.controller.js"
import { verifyToken } from "../middleWares/isSignedIn.js";


const router = Router();



router.get("/" ,verifyToken, getAllJobs);
router.post("/" , verifyToken, createJob);
router.delete("/:jobId" , verifyToken , deleteJob);
router.get("/:jobId" , verifyToken , getJob );
router.put("/:jobId" , verifyToken , updateJob);

export default router;