import { Router } from "express";
import { createSession } from "../controllers/ai.controller.js";


const router = Router();


router.post("/session" , createSession);

export default router;