"use client"
import ApplicationPopup from "@/components/ApplicationPopup";
import { useState } from "react"



export default function jobApplication(){

    const [popUp , setPopUp] = useState(false);


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

            {popUp && ( <ApplicationPopup onClose = {() => setPopUp(false)}/>)}


        </div>
    )
}