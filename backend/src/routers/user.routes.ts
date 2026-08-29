import { Router } from "express";
import { signUp , signIn , currUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleWares/isSignedIn.js";


const router = Router();



router.post("/signup" , signUp);
router.post("/signin" , signIn);
router.get("/" , verifyToken , currUser);

// when the project will be completed i will add forgot password functionality by sending mail


export default router