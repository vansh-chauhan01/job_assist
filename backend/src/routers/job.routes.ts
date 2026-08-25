import { Router } from "express";
import { getJobs , createJob , deleteJob} from "../controllers/job.controller.js"
import { verifyToken } from "../middleWares/isSignedIn.js";


const router = Router();



router.get("/" ,verifyToken, getJobs);
router.post("/" , verifyToken, createJob);
router.delete("/:jobId" , verifyToken , deleteJob);


export default router;