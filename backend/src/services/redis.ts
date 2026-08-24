import { createClient } from "redis";
import type { RedisClientType } from "redis";


let client : RedisClientType | null = null ;
let isRedisConnected = false;


const connectToRedis = async()=>{
    try{
        client =  createClient({
            url : process.env.REDIS_URL ||  'redis://localhost:6379',
            socket : {
                reconnectStrategy : false // it will not try to again and again try to connnect to redis and fail api
            }
        })

        client.on('error', (e)=>{
            console.log("Reddis error" , e.message);
            isRedisConnected = false;
        })

        client.on("connect" , ()=>{
            isRedisConnected = true;
        })

        client.on('end' , ()=>{
            isRedisConnected = false
        })

        await client.connect()
        isRedisConnected = true;
        return client
    }catch(e){
        client = null;
        isRedisConnected = false;
        return null;
    }
    
}


const getCache = async(key : string)=>{
    try{
        if(!isRedisConnected || !client){
            return null
        }
        
        const cachData = await client.get(key);
        
        return cachData ? JSON.parse(cachData) : null

    }catch(e){
        console.log("error fetching data from redis" , e);
        return null;
    }
}


const setCache = async(key : string , value : any, expireTime : number = 3600) =>{
    try{
        if(!isRedisConnected || !client){
            return null;
        }

        await client.set(key , JSON.stringify(value) , { EX : expireTime}); // expire after 45 min
        
        return true

    }catch(e : unknown){
        console.log("error setting cache" , e);
        return null
    }
}


const deleteCache = async(key : string) =>{
    try{
        if(!isRedisConnected || !client){
            return false;
        }

        await client.del(key);
        return true;

    }catch(e){
        console.log("error deleting cache" , e);
    }
}







export { connectToRedis , getCache , setCache , deleteCache };


  








