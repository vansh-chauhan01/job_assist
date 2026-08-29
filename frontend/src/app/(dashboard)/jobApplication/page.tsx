"use client"
import ApplicationPopup from "@/components/ApplicationPopup";
import axios from "axios";
import { useEffect, useState } from "react"

interface job{
    id?: number,
    userId?: number,
    companyName?: string,
    role?: string,
    referral?: boolean,
    remote?: boolean,
    openingType? : string
}



export default function jobApplication(){

    const [popUp , setPopUp] = useState(false);
    const [jobData , setJobData] = useState<job[]>([]);
    useEffect(()=>{
        const getJobData = async()=>{
            try{
                const jobsData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/job/`, { withCredentials : true });
                setJobData(jobsData.data.jobs);
            }catch(e){
                console.log("couldnt fetch job");
            }
        }
        getJobData();
        
    },[])

    return (
        <div>
            <div>
                <p>
                    Job Applications
                </p>
                <button onClick={()=>setPopUp(true)}>
                    + Add Application
                </button>
            </div>

            
            {    
                jobData.map(element => {
                    return <div>{element.companyName}</div>
                })
            }

            {popUp && ( <ApplicationPopup onClose = {() => setPopUp(false)}  onJobAdded= {(newJob)=>{setJobData(prev => [...prev , newJob ])}}/>)}


        </div>
    )
}