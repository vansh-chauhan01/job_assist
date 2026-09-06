"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";



export default function aiAssistant() {

    const router = useRouter();

    const [file , setFile] = useState<File | null>(null);
    const [resumeId , setResumeId] = useState<number | null>(null);
    const [jobDescription , setJobDescription] = useState<string | null>(null);

    const handleStartInterview = async()=>{
        // make an api call to create a new interview and get the interview id
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/interview`, {
                resumeId : resumeId,
                jobDescription : jobDescription
            } , { withCredentials : true});

            router.push("/interview/" + res.data.newInterview.id);
        }catch(e){
            console.log("error creating interview", e);
        }

        
    }

    

    const handleFileChange = (event : React.ChangeEvent<HTMLInputElement>)=>{
        const file = event.target.files?.[0];
        if(!file){
            console.log("please select a file");
            return
        }
        
        if (file && file.size > 5 * 1024 * 1024) {
            console.log('File must be under 5MB')
            return
        }
        setFile(file);
    }

    const handleUpload = async()=>{
        try{
            if(!file){
                console.log("please select a file");
                return
            }
            const formData = new FormData();
            formData.append('file', file);// if not done like this, axios will stringify this and multer will not be able to see it

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/resume`,
                formData,
                {
                    withCredentials: true,
                }
            )
            setResumeId(res.data.newResume.id);
        }catch(e){
            console.log("error uploading file", e);
        }
    }


    return (
        <div>
            <p>upload your fucking resume bitch ass</p>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Resume</button>
            <input type ="text" placeholder="Job Description" onChange={(e) => setJobDescription(e.target.value)} />

            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleStartInterview}>Start Interview now !!!!!!!!</button>
            
        </div>
    )
}