"use client"
import { useState } from "react";
import axios from "axios";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/navigation";

export default function signUp(){

    const [userName , setUserName] = useState("");
    const [password , setPassword] = useState("");
    const [email , setEmail] = useState("");
    const [token , setToken] = useState("");
    const router = useRouter();

    const handleSubmit = async()=>{
        console.log(`${process.env.NEXT_PUBLIC_SITE_KEY!}`)
        await axios.post("http://localhost:8080/api/v1/user/signup" , {username : userName, email : email , password : password , token : token})
        router.push("/auth/signIn")
    }

    return <div>
        <input type="text" placeholder="userName" onChange={e =>{setUserName(e.target.value)}}></input>
        <input type="password" placeholder="Enter Your Password" onChange={e => {setPassword(e.target.value)}}></input>
        <input type="text" placeholder="Enter Your email" onChange={e => {setEmail(e.target.value)}}></input>
        <button onClick={handleSubmit}>signUp</button>
        <Turnstile siteKey={process.env.NEXT_PUBLIC_SITE_KEY!} onSuccess={(token) =>{
            console.log("i gave a token")
            setToken(token)
        }}
        onError={()=> console.log("gand phat gayi")}
        />
    </div>
}