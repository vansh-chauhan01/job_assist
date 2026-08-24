import express from "express";
import userRouter from "./routers/user.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { rateLimit } from 'express-rate-limit'
import jobRouter from "./routers/job.routes.js"
import { prisma } from "./db_init.js";
import { connectToRedis } from "./services/redis.js";


const app = express();

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	limit: 15, // Limit each IP to 15 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive

    handler : (req , res) =>{
        return res.status(429).json({
            message : "you sent many request only 15 request per minutes are allowed"
        })
    }
})

app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin : ["http://localhost:3000"],
    credentials : true
}))


app.use("/api/v1/user/" , userRouter);
app.use("/api/v1/job/" , jobRouter);


app.get("/" , limiter , (req , res) =>{
    return res.json({
        message : "this is working"
    })
})


async function startServer() {
    try{
        await prisma.$connect();
        console.log("database connected");
        
        await connectToRedis();

        app.listen(8080 , async() =>{
            console.log("database connected")
        })
        
    }catch(e){
        console.log("error initializing server" , e);
    }
    
}


startServer();

