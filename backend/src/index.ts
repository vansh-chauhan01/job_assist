import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"
import { rateLimit } from 'express-rate-limit'
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
// Parse raw SDP payloads posted from the browser
app.use(express.text({ type: ["application/sdp", "text/plain"] }));
app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin : ["http://localhost:3000"],
    credentials : true
}))


// api routing
import userRouter from "./routers/user.routes.js"
import jobRouter from "./routers/job.routes.js"
import taskRouter from "./routers/tasks.routes.js"
import loggRouter from "./routers/logg.routes.js"
import aiRouter from "./routers/ai.routes.js"

app.use("/api/v1/user/" , userRouter);
app.use("/api/v1/job/" , jobRouter);
app.use("/api/v1/task/" , taskRouter);
app.use("/api/v1/logg/" , loggRouter);
app.use("/api/v1/ai/" , aiRouter);


app.get("/" , limiter , (req , res) =>{
    return res.json({
        message : "this is working"
    })
})


async function startServer() {
    try{
        await prisma.$connect();
        console.log("database connected");

        app.listen(8080, () => {
            console.log("server started");
        });
        

        const redis = await connectToRedis();

        if (redis) {
            console.log("redis connected");
        } else {
            console.log("redis unavailable — continuing without cache");
        }

        

        
        
    }catch(e){
        console.log("error initializing server" , e);
    }
    
}


startServer();

