"use client"



import { useState , useEffect } from "react";
import axios from "axios";


export default function Loggs(){


    const [loggs , setLoggs] = useState([])

    useEffect(()=>{
        const fetchLoggs = async()=>{
            try{
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logg/` , { withCredentials : true });
                setLoggs(res.data.loggs)
            }
            catch(e){
                console.error("Error fetching loggs:", e);
            }
        }
        fetchLoggs();
    } , [])




    return (
        <div>
            <p className="text-3xl font-semibold mb-4">
                Your Loggs
            </p>
            {loggs.map((logg : any , index : number) => (
                <div key={index} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-4">
                    <div className="mb-5">
                        <h3 className="font-semibold text-lg">{new Date(logg.date).toLocaleDateString()}</h3>
                        <div className="flex gap-2">
                            <p className="font-medium">Rating:</p>
                            <p className="text-sm text-gray-500"> {logg.rating}</p>
                        </div>
                        <p className="font-medium">Description:</p>
                        <p className="whitespace-pre-line">
                            {logg.description.replace(/\\n/g, "\n")}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}