"use client"
import axios from "axios"
import { useEffect, useState } from "react"


type task = {
    id : number,
    title : string,
    userId : number,
    completed : boolean
}

export default function tasks (){

    const [task , setTask] = useState<task[]>([]);
    const [newTask , setNewTask] = useState("");


    useEffect(()=>{
        const getTask = async()=>{
            try{
                const exsistingTask = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/task`, { withCredentials : true });
                setTask(exsistingTask.data.tasks);
            }catch(e){
                console.log(e);
            }
        }
        
        

        getTask();
    },[])

    const handleAddNewTask = async()=>{
        try{
            const addTask = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/task` , { title : newTask , completed : false} , { withCredentials : true});
            const data = addTask.data.newTask;
            
            setTask(prev => [...prev , data]);

            setNewTask("");
        }catch(e){
            console.log(e);
        }
    }


    return <div>

        <div>
            <div>
                <input type="text" placeholder = "Add a new task" onChange={(e)=> setNewTask(e.target.value)}/> 
                <button onClick={handleAddNewTask}>
                    Add Task
                </button>
            </div>
            {/* now i will have to just make an component and render all the task */}
        </div>


    </div>
}