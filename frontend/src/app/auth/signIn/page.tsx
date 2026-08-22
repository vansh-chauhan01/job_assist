"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn () {

    const router = useRouter();

    const [userName , setUserName] = useState("");
    const [password , setPassword] = useState("");

    const handleSubmit = async()=>{
        const currUser = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signin` , {username : userName , password : password} , { withCredentials : true});
        router.push("/")
    }

    return (
        <div>
            <input type="text" placeholder="enter your userName" onChange={(e) =>{
                setUserName(e.target.value)
            }}></input>
            <input type="password" placeholder="enter your password" onChange={(e) =>{
                setPassword(e.target.value)
            }}></input>
            <button onClick={handleSubmit}>logIn</button>
            
        </div>
    )
}