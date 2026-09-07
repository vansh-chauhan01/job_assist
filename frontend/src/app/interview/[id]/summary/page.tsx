"use client"

import { useParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";


export default function Summary(){

    const { id } = useParams<{ id: string }>();
    
    useEffect(()=>{
        const getSummary = async()=>{
            try{
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/summary?interviewId=${id}` , { withCredentials : true })
            }catch(e){

            }
        }

        getSummary()

    },[])


    return (
        <div>
            this is an summary page
        </div>
    )
}