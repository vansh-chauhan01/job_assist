import type { Request , Response } from "express"
import { createJobSchema } from "../zodSchema/jobSchem.js"
import { prisma } from "../db_init.js";
import client from "../services/redis.js";



export const createJob = async(req : Request , res : Response) =>{
    try{
        const parsedData = createJobSchema.safeParse(req.body);
        if(!parsedData.success){
            return res.status(400).json({
                message : parsedData.error.issues
            })
        }
        const userId = Number(req.user_id!);
        const { companyName , role , referral , remote } = parsedData.data;

        const newJob = await prisma.job.create({
            data :{
                userId : userId ,
                companyName : companyName,
                role : role ,
                referral : referral ,
                remote : remote
            }
        })

        if(!newJob){
            return res.status(500).json({
                message : "couldnt create this entry in database"
            })
        }

        return res.status(201).json({
            newJob
        })


    }catch(e){
        return res.status(500).json({
            message : "couldnt create this entry in database"
        })
    }
}

export const getJobs = async(req : Request , res : Response) =>{
    try{
        
        const jobs = await prisma.job.findMany({
            where : {
                userId : Number(req.user_id)
            }
        })
        
        if(!jobs){
            return res.status(500).json({
                message : "couldnt fetch jobs"
            })
        }
        return res.status(200).json({
            jobs
        })
    }catch(e){
        return res.status(500).json({
            message : "couldnt fetch jobs"
        })
    }
}