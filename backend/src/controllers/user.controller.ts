import type { Request , Response } from "express"
import { signInSchema , signUpSchema } from "../zodSchema/userSchema.js"
import { prisma } from "../db_init.js"
import bcrypt from "bcryptjs"

export const signUp = async (req : Request , res : Response) =>{

    try{
        
        const parsedData = signUpSchema.safeParse(req.body);
        if(!parsedData.success){
            return res.status(400).json({
                message : parsedData.error.message
            })
        }
        const {username , password , email} = parsedData.data;
        
        const hashPass = await bcrypt.hash(password , 10);

        const newUser = await prisma.user.create({
            data : {
                userName : username,
                email : email,
                password : hashPass
            }
        })

        return res.status(201).json({
            message : "new user Created"
        })
    }catch(e){
        return res.status(401).json({
            message : e
        })
    }
   
    

}


export const signIn = (req : Request , res : Response) =>{
    return res.json({
        message : "signin api"
    })
}