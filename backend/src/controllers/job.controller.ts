import type { Request , Response } from "express"
import { createJobSchema } from "../zodSchema/job.zod.schema.js"
import { prisma } from "../db_init.js";
import { getCache , setCache , deleteCache } from "../services/redis.js";




export const createJob = async(req : Request , res : Response) =>{
    try{
        const parsedData = createJobSchema.safeParse(req.body);
        if(!parsedData.success){
            return res.status(400).json({
                message : parsedData.error.issues
            })
        }
        const userId = Number(req.user_id!);
        const { companyName , role , referral , remote ,openingType } = parsedData.data;

        const newJob = await prisma.job.create({
            data :{
                userId : userId ,
                companyName : companyName,
                role : role ,
                referral : referral ,
                remote : remote,
                openingType : openingType
            }
        })

        if(!newJob){
            return res.status(500).json({
                message : "couldnt create this entry in database"
            })
        }

        await deleteCache(`job:${userId}`);

        return res.status(201).json({
            newJob
        })


    }catch(e){
        return res.status(500).json({
            message : "couldnt create this entry in database"
        })
    }
}

export const getAllJobs = async(req : Request , res : Response) =>{
    try{
        const key = `job:${req.user_id}`
        const cacheData = await getCache(key);


        if(cacheData){
            // already parsing it in getCache function
            
            return res.status(200).json({
                jobs : cacheData
            })

        }


        
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

        await setCache(key , jobs , 120);

        return res.status(200).json({
            jobs : jobs
        })
    }catch(e){
        return res.status(500).json({
            message : "couldnt fetch jobs"
        })
    }
}


export const deleteJob = async(req : Request , res : Response)=>{
    try{
        const { jobId } = req.params;
        const id = Number(jobId)
        if(!id){
            return res.status(400).json({
                message : "didnt recieve jobId"
            })
        }
        
        const deletedJob = await prisma.job.delete({
            where : {
                id : id,
                userId : Number(req.user_id!)
            }
        })

        const key = `job:${req.user_id}`
        const delCache = await deleteCache(key);

        if(delCache){
            console.log("cache deleted")
        }




        return res.status(200).json({
            message : "job Deleted successfully"
        })
    }catch(e){
        return res.status(500).json({
            message : "error deleting Job",
            error : e,
        })
    }
}

export const getJob = async(req : Request, res : Response)=>{
    try{
        const jobId = Number(req.params.jobId);
        if(!jobId){
            return res.status(400).json({
                message : "job id is required"
            })
        }

        const userId = Number(req.user_id!);


        const job = await prisma.job.findFirst({
            where : {
                id : jobId,
                userId : userId
            }
        })

        return res.status(200).json({
            jobs : job
        })

    }catch(e){
        return res.status(500).json({
            message : "couldnt fetch this job",
            e : e
        })
    }
}


export const updateJob = async (req: Request, res: Response) => {
    try {
        const jobId = Number(req.params.jobId);

        if (!Number.isInteger(jobId) || jobId <= 0) {
            return res.status(400).json({
                message: "Invalid job ID",
            });
        }

        const userId = Number(req.user_id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const {
            companyName,
            role,
            referral,
            remote,
            openingType,
        } = req.body;

        const updatedData = {
            ...(companyName !== undefined && { companyName }),
            ...(role !== undefined && { role }),
            ...(referral !== undefined && { referral }),
            ...(remote !== undefined && { remote }),
            ...(openingType !== undefined && { openingType }),
        };

        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                message: "No fields provided for update",
            });
        }

        const updatedJob = await prisma.job.update({
            where: {
                id: jobId,
                userId: userId,
            },
            data: updatedData,
        });

        return res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob,
        });
    } catch (error) {
        console.error("updateJob error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
