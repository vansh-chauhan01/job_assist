import  jwt  from "jsonwebtoken"
import type { NextFunction, Request , Response } from "express"


export const verifyToken = (req : Request , res : Response , next : NextFunction) =>{
    try{
        const token = req.cookies.access_token
        if(!token){
            return res.status(401).json({
                message : "you are not siggned in"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId : string};
        // extended the type of this request ibject
        req.user_id = decoded.userId 
        return next();

    }catch(e){
        return res.status(401).json({
            message : "please login"
        })
    }
}