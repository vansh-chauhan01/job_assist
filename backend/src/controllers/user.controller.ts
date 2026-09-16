import type { Request , Response } from "express"
import { signInSchema , signUpSchema } from "../zodSchema/user.zod.schema.js"
import { prisma } from "../db_init.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"



export const signUp = async (req : Request , res : Response) =>{

    try{
        
        const parsedData = signUpSchema.safeParse(req.body);
        if(!parsedData.success){
            return res.status(400).json({
                message : parsedData.error.message
            })
        }
        const {username , password , email } = parsedData.data;
        


        const alreadyExsist = await prisma.user.findFirst({
            where :{
                userName : username
            }
        })
        if(alreadyExsist){
            return res.status(401).json({
                message : "user already exsist with this name"
            })
        }
        
        const hashPass = await bcrypt.hash(password , 10);
        console.log("api hit")

        const newUser = await prisma.user.create({
            data : {
                userName : username,
                email : email,
                password : hashPass
            }
        })

        const Acesstoken = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!);
        return res.status(200).cookie("access_token" , Acesstoken, {
            httpOnly : true,
        }).json({
            newUser
        })
    }catch(e){
        return res.status(401).json({
            message : e
        })
    }
   
    

}


export const signIn = async (req : Request , res : Response) =>{
    try{
        const parsedData = signInSchema.safeParse(req.body);
        if(!parsedData.success){
            return res.status(400).json({
                message : parsedData.error.message
            })
        }
        const {username , password} = parsedData.data;
        const currUser = await prisma.user.findFirst({
            where : {
                userName : username
            }
        })
        if(!currUser){
            return res.status(404).json({
                message : "couldnt find this user"
            })
        }
        
        const isPasswordCorrect = await bcrypt.compare(password ,currUser.password );

        if(!isPasswordCorrect){
            return res.status(400).json({
                message : "your password is incorrect"
            })
        }
       const { password: _, ...newUser } = currUser;
       
        const token = jwt.sign({ userId: currUser.id }, process.env.JWT_SECRET!);
        return res.status(200).cookie("access_token" , token, {
            httpOnly : true,
        }).json({
            newUser
        })
    }catch(e){
        return res.status(500).json({
            message : e
        })
    }
    

}

export const currUser = async (req : Request , res : Response) =>{
    try{

        const user_id = Number(req.user_id!);
        const currUser = await prisma.user.findFirst({
            where : {
                id : user_id
            },
            include: {
                jobs: true,
                tasks: true,
            },
            omit : {
                password : true
            }
        })

        if(!currUser){
            return res.status(404).json({
                message : "couldnt find user"
            })
        }

        return res.status(200).json({
            currUser : currUser
        })


    }catch(e){
        return res.status(404).json({
            message : "couldnt find user",
            e : e
        })
    }
}


export const logout = async (req : Request , res : Response) =>{
    try{
        res.clearCookie("access_token", {
            httpOnly : true ,
            secure: true,
            sameSite: "none",
            path: "/",
        })

        return res.status(200).json({
            message : "user logged out successfully"
        })

    }catch(e){
        return res.status(500).json({
            message : "error logging out user"
        })
    }
}