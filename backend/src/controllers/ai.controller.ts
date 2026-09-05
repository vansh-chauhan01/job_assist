import type { Request , Response } from "express";


const sessionConfig = JSON.stringify({
  type: "realtime",
  model: "gpt-realtime-2.1-mini",
  audio: { output: { voice: "marin" } },
});


export const createSession = async (req : Request , res : Response)=>{
    const fd = new FormData();
    fd.set("sdp", req.body);
    fd.set("session", sessionConfig);

    try {
        const r = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Safety-Identifier": "hashed-user-id",
        },
        body: fd,
        });
        
        // Send back the SDP we received from the OpenAI REST API
        const sdp = await r.text();
        console.log("OpenAI status:", r.status);
        console.log("OpenAI response:", sdp);
        res.send(sdp);
    } catch (error) {
        console.error("Token generation error:", error);
        res.status(500).json({ error: "Failed to generate token" });
    }
}