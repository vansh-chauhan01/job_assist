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
    const transcriptEndRef = useRef<HTMLDivElement>(null);
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [ending, setEnding] = useState(false);
    const [status, setStatus] = useState<"connecting" | "live" | "disconnected">("connecting");

    useEffect(() => {
        (async () => {
            try {
                const pc = new RTCPeerConnection();
                pcRef.current = pc;

                pc.ontrack = (e) => (audioRef.current!.srcObject = e.streams[0]!);

                // status indicator only — doesn't affect the connection itself
                pc.onconnectionstatechange = () => {
                    if (pc.connectionState === "connected") setStatus("live");
                    else if (["disconnected", "closed", "failed"].includes(pc.connectionState)) {
                        setStatus("disconnected");
                    }
                };

                const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = localStream;
                pc.addTrack(localStream.getTracks()[0]);

                // data chanel to script the interview
                const dc = pc.createDataChannel("oai-events");

                dc.addEventListener("message", (event) => {
                    const data = JSON.parse(event.data);
                    console.log(data.type);

                    if (data.type === "conversation.item.input_audio_transcription.completed") {
                        setTranscript((prev) => [...prev, { role: "user", text: data.transcript }]);
                    }

                    if (data.type === "response.output_audio_transcript.done") {
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
                setStatus("disconnected");
            }
        })();

        return () => {
            pcRef.current?.close();
            streamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcript]);

    const handleEndInterview = async () => {
        setEnding(true);
        try {
            //end p2p  live connection
            pcRef.current?.close();
            streamRef.current?.getTracks().forEach((track) => track.stop());

            //save the transcript
            await axios.patch(
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

    const statusConfig = {
        connecting: { label: "Connecting...", dot: "bg-amber-400" },
        live: { label: "Live", dot: "bg-emerald-500" },
        disconnected: { label: "Disconnected", dot: "bg-red-400" },
    }[status];

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <audio ref={audioRef} autoPlay />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">Mock interview</h1>
                    <div className="mt-1 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${statusConfig.dot} ${status === "live" ? "animate-pulse" : ""}`} />
                        <span className="text-sm text-gray-500">{statusConfig.label}</span>
                    </div>
                </div>

                <button
                    onClick={handleEndInterview}
                    disabled={ending}
                    className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                    {ending ? "Ending..." : "End interview"}
                </button>
            </div>

            {/* Transcript */}
            <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-6 py-8">
                {transcript.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                            <span className="h-3 w-3 rounded-full bg-indigo-500" />
                        </div>
                        <p className="mt-4 text-sm text-gray-400">
                            Your conversation will appear here as you speak.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {transcript.map((entry, i) => (
                            <div
                                key={i}
                                className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-md rounded-2xl px-4 py-2.5 text-sm ${
                                        entry.role === "user"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-100 text-gray-900"
                                    }`}
                                >
                                    <p className="mb-0.5 text-xs font-medium opacity-70">
                                        {entry.role === "user" ? "You" : "Interviewer"}
                                    </p>
                                    {entry.text}
                                </div>
                            </div>
                        ))}
                        <div ref={transcriptEndRef} />
                    </div>
                )}
            </div>
        </div>
    );
}