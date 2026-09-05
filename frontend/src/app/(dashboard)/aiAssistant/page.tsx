"use client"
import { useRouter } from "next/navigation";


export default function aiAssistant() {

    const router = useRouter();

    const handleStartInterview = ()=>{
        // make an api call to create a new interview and get the interview id
        router.push("/interview/")
    }


    return (
        <div>
            <p>start your interview</p>
            <button onClick = {handleStartInterview}>
                start your interview
            </button>
        </div>
    )
}