"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";


export default function Summary(){

    const { id } = useParams<{ id: string }>();
    const [data , setData] = useState({})
    
    useEffect(()=>{
        const getSummary = async()=>{
            try{
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/summary?interviewId=${id}` , { withCredentials : true });
                setData(res.data);
            }catch(e){

            }
        }

        getSummary()

    },[])


    return (
        <div>
            
        </div>
    )
}