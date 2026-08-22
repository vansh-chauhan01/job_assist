import type { Request , Response } from "express"



export const createJob = (req : Request , res : Response) =>{
    try{
        return res.json({
            
        })
    }catch(e){

    }
}

export const getJobs = (req : Request , res : Response) =>{
    return res.json({
        message : "hi from job"
    })
}