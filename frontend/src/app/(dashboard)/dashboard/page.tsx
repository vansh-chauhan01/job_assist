"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect , useState } from "react"







export default function dashBoard(){

    const router = useRouter();

    const [tasks , setTasks] = useState([]);
    const [jobs , setJobs] = useState([]);

    const sendToTaskPage = ()=>{
        router.push("/tasks")
    }


    useEffect( ()=>{
        
        const getTaskData = async()=>{
            try{
                const taskData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/task`, { withCredentials : true});
                console.log(taskData);
                setTasks(taskData.data.tasks);
            }
            catch(e){
                console.error("Failed to fetch tasks:", e);
            }
        }

        const getJobData = async ()=>{
            try{
                const jobData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/job` , { withCredentials : true });
                setJobs(jobData.data.jobs);
            }catch(e){
                console.error("failed to get job Data" , e);
            }
        }



        getTaskData();
        getJobData();

         
    }, [])



    return (

        


        <div>

            <div>
                sidebar
                <div>
                    <div onClick={sendToTaskPage}>
                        add tasks
                    </div>
                    
                </div>
            </div>


            // tasks
            <div>
                <p>
                    active job application
                </p>
                <p className="text-white">{jobs.length}</p>

            </div>
            <br /><br /><br />
            <div>
                <p>
                    tasks remaining
                </p>
                <p className="text-white">
                    {tasks.length}
                </p>
            </div>

        </div>
    )
}