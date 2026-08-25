import { Router } from "express";
import { verifyToken } from "../middleWares/isSignedIn.js";
import { getTask , addTask , deleteTask , updateTask } from "../controllers/task.controller.js";

const router = Router();


router.get("/" , verifyToken , getTask);

router.post("/" , verifyToken , addTask);

router.delete("/:taskId" , verifyToken , deleteTask);

router.put("/:taskId" , verifyToken , updateTask);




export default router