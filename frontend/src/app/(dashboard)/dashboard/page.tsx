"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect , useState } from "react"



export default function dashBoard(){

    const router = useRouter();

    const [data , setData] = useState({});
    

    const sendToTaskPage = ()=>{
        router.push("/tasks")
    }


    useEffect( ()=>{
        const getData = async()=>{
            try{
                const userData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/` , { withCredentials : true });
                setData(userData.data.currUser);
            }catch(e){
                console.log("error fetching user data", e);
            }
        }         
    }, [])



    return (

        


        <div>

            <div>
                sidebar
                <div>
                    <div onClick={sendToTaskPage}>
                        add tasks
                    </div>
                    
                </div>
            </div>


            // tasks
            <div>
                <p>
                    active job application
                </p>
                
            </div>
            <br /><br /><br />
            <div>
                <p>
                    tasks remaining
                </p>
                <p >
                    
                </p>
            </div>

        </div>
    )
}