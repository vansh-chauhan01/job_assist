import { Router } from "express";
import { verifyToken } from "../middleWares/isSignedIn.js";
import { logToday , getHeatMap , getLoggs } from "../controllers/logg.controller.js";


const router = Router();



router.post("/" , verifyToken , logToday);
router.get("/heatmap" , verifyToken , getHeatMap);
router.get("/" , verifyToken , getLoggs);


export default router;