import type { Request , Response } from "express"
import { prisma } from "../db_init.js";
import { createTaskSchema } from "../zodSchema/task.zod.schema.js";



export const getTask = async( req : Request , res : Response) =>{
    try {
        const userId = Number(req.user_id!);

        const tasks = await prisma.tasks.findMany({
            where : {
                userId : userId
            }
        })

        return res.status(200).json({
            tasks
        })



    } catch (e) {
        return res.status(500).json({
            message : "couldnt get tasks",
            e : e
        })
    }
}


export const addTask = async( req : Request , res : Response) =>{
    try{
        console.log("hi1")
        console.log(req.body)
        const parsedData = createTaskSchema.safeParse(req.body);
        if(!parsedData.success){
            return res.status(400).json({
                message : parsedData.error.message
            })
        }
        console.log("hi2")

        const { title } = parsedData.data 
        const user_id = Number(req.user_id)

        const newTask = await prisma.tasks.create({
            data : {
                title : title,
                userId : user_id!,
                completed : false,
            }
        })
        console.log("hi3")

        return res.status(201).json({
            newTask
        })



    }catch(e){
        return res.status(500).json({
            message : "couldnt create new task",
            e : e
        })
    }
}


export const deleteTask = async( req : Request , res : Response) =>{
    try{
        const { taskId } = req.params
        const id = Number(taskId);
        if(!id){
            return res.status(400).json({
                message : "couldnt get taskId query param"
            })
        }

        const deltask = await prisma.tasks.delete({
            where : {
                id : id,
                userId : Number(req.user_id!)
            }
        })


        return res.status(200).json({
            message : "task deleted"
        })



    }catch(e){
        return res.status(500).json({
            message : "couldnt delete this task",
            e : e
        })
    }

}



type newData = {
    title? : string ,
    completed? : boolean
}

export const updateTask = async( req : Request , res : Response )=>{
    try{

        const { taskId } = req.params
        const id = Number(taskId);
        if(!id){
            return res.status(400).json({
                message : "couldnt get taskId query param"
            })
        }

        const { title , completed } = req.body;

        const newData : newData = {};
        if(title !== undefined) newData.title = title;
        if(completed !== undefined) newData.completed = completed;

        const updatedTask = await prisma.tasks.update({
            where : {
                id : id,
                userId : Number(req.user_id!)
            },
            data :newData
        }) 

        res.status(200).json({
            updatedTask
        })


    }catch(e){
        return res.status(400).json({
            message : "couldnt update this task",
            e : e
        })
    }
}