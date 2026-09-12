import { Router } from "express";
import { createSession , resumeUpload , createInterview , saveTranscript , makeSummary , getInterviews } from "../controllers/ai.controller.js";
import { verifyToken } from "../middleWares/isSignedIn.js";
import { upload } from "../middleWares/multer.js";


const router = Router();


router.post("/session" , verifyToken , createSession);
router.post("/resume" , verifyToken , upload.single('file') , resumeUpload);
router.post("/interview" , verifyToken , createInterview);
router.patch("/interview/:interviewId" , verifyToken , saveTranscript)
router.get("/summary" , verifyToken , makeSummary);
router.get("/history" , verifyToken , getInterviews);

export default router;