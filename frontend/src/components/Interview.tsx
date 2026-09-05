"use client"
import { useRouter } from "next/navigation";


export default function Interview() {

    const router = useRouter();

    const handleStartInterview = ()=>{
        router.push("/interview/start")
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