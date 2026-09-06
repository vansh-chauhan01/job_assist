"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

type TranscriptEntry = {
    role: "user" | "assistant";
    text: string;
};

export default function Interview() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const pcRef = useRef<RTCPeerConnection | undefined>(undefined);
    const streamRef = useRef<MediaStream | undefined>(undefined);
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [ending, setEnding] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const pc = new RTCPeerConnection();
                pcRef.current = pc;

                pc.ontrack = (e) => (audioRef.current!.srcObject = e.streams[0]!);

                const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = localStream;
                pc.addTrack(localStream.getTracks()[0]);
                
                // data chanel to script the interview
                const dc = pc.createDataChannel("oai-events");

                dc.addEventListener("message", (event) => {
                    const data = JSON.parse(event.data);

                    if (data.type === "conversation.item.input_audio_transcription.completed") {
                        setTranscript((prev) => [...prev, { role: "user", text: data.transcript }]);
                    }

                    if (data.type === "response.audio_transcript.done") {
                        setTranscript((prev) => [...prev, { role: "assistant", text: data.transcript }]);
                    }
                });

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                const sdpResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/session?interviewId=${id}`,
                    {
                        method: "POST",
                        body: offer.sdp,
                        credentials: "include",
                        headers: { "Content-Type": "application/sdp" },
                    }
                );

                const answer: RTCSessionDescriptionInit = {
                    type: "answer",
                    sdp: await sdpResponse.text(),
                };
                await pc.setRemoteDescription(answer);
            } catch (e) {
                console.log("error in interview page", e);
            }
        })();

        return () => {
            pcRef.current?.close();
            streamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    const handleEndInterview = async () => {
        setEnding(true);
        try {
            //end p2p  live connection
            pcRef.current?.close();
            streamRef.current?.getTracks().forEach((track) => track.stop());

            //save the transcript
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/interview/${id}`,
                { transcript },
                { withCredentials: true }
            );

            router.push(`/interview/${id}/summary`); 
        } catch (e) {
            console.log("error ending interview", e);
        } finally {
            setEnding(false);
        }
    };

    return (
        <div>
            <p>this is an interview page</p>
            <audio ref={audioRef} autoPlay />

            <button onClick={handleEndInterview} disabled={ending}>
                {ending ? "Ending..." : "End Interview"}
            </button>

            <div>
                {transcript.map((entry, i) => (
                    <p key={i}>
                        <strong>{entry.role === "user" ? "You" : "Interviewer"}:</strong> {entry.text}
                    </p>
                ))}
            </div>
        </div>
    );
}