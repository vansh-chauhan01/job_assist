import type { Request , Response } from "express"
import { dayLoggSchema } from "../zodSchema/logg.zod.schema.js"
import { prisma } from "../db_init.js";

export const logToday = async(req : Request , res : Response)=>{
    try{
        const parsedData = dayLoggSchema.safeParse(req.body);
        if(!parsedData.success){
            return res.status(400).json({
                message : parsedData.error.message
            })
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); //it will strip the time, only date remains

        const userId = Number(req.user_id!);
        const {description , rating , date} = parsedData.data
        const parsedDate = new Date(date);// convert string date to js date
       

        // if logg for today already exist update it otherwise make it.
        const newLog = await prisma.loggs.upsert({
            where : {
                userId_date : {userId , date : parsedDate}
            },
            update: { rating, description },
            create: { userId, date: parsedDate, rating, description },
        })

        return res.status(201).json({
            todaysLogg : newLog
        })

    }catch(e){
        return res.status(500).json({
            message : "couldnt create/update this logg",
            e : e
        })
    }
}


export const getHeatMap = async(req : Request , res : Response)=>{
    try{

        const to = new Date();
        to.setHours(23, 59, 59, 999); // include all of today

        const from = new Date(to.getTime() - 365 * 24 * 60 * 60 * 1000);
        from.setHours(0, 0, 0, 0); // start of that day, 365 days ago. like an sliding window
        
        const userId = Number(req.user_id!);

        const loggs = await prisma.loggs.findMany({
            where : {
                userId : userId,
                date : { gte : from , lte : to},
            },
            select : {
                rating : true ,
                description : true,
                date : true
            }
        })

        return res.status(200).json({
            loggs : loggs
        })



    }catch(e){
        return res.status(500).json({
            message : "couldnt fetch loggs",
            e : e
        })
    }
}