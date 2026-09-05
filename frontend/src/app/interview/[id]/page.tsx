"use client";
import { useEffect, useRef } from "react";

export default function Interview() {

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        try {
        (async () => {
            // Create a peer connection
            const pc = new RTCPeerConnection();

            //Set up to play remote audio from the model
            // audioRef.current = document.createElement("audio");
            // audioRef.current.autoplay = true;
            pc.ontrack = (e) => (audioRef.current!.srcObject = e.streams[0]!);

            // Add local audio track for microphone input in the browser
            const ms = await navigator.mediaDevices.getUserMedia({
            audio: true,
            });
            pc.addTrack(ms.getTracks()[0]);

            // Set up data channel for sending and receiving events
            const dc = pc.createDataChannel("oai-events");

            // Start the session using the Session Description Protocol (SDP)
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            const sdpResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/session`, {
            method: "POST",
            body: offer.sdp,
            headers: {
                "Content-Type": "application/sdp",
            },
            });

            const answer : RTCSessionDescriptionInit  = {
            type: "answer",
            sdp: await sdpResponse.text(),
            };
            await pc.setRemoteDescription(answer);
        })();
        } catch (e) {
        console.log("error in interview page", e);
        }
    }, []);

  return(
    <div>
        <p>this is an interview page</p>
         <audio ref={audioRef} autoPlay />
    </div>

  ) 
}
