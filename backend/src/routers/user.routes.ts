import { Router } from "express";
import { signUp , signIn } from "../controllers/user.controller.js";


const router = Router();



router.post("/signup" , signUp);
router.post("/signin" , signIn);

// when the project will be completed i will add forgot password functionality by sending mail


export default router