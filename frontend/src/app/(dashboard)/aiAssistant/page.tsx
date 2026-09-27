"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function AiAssistant() {
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [resumeId, setResumeId] = useState<number | null>(null);
    const [jobDescription, setJobDescription] = useState<string>("");

    const [isUploading, setIsUploading] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files?.[0];
        if (!selected) return;

        if (selected.size > 5 * 1024 * 1024) {
            setError("File must be under 5MB.");
            return;
        }

        setError(null);
        setFile(selected);
        setResumeId(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Choose a resume file first.");
            return;
        }

        setIsUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/resume`,
                formData,
                { withCredentials: true }
            );
            setResumeId(res.data.newResume.id);
        } catch (e) {
            console.log("error uploading file", e);
            setError("Couldn't upload that file. Try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleStartInterview = async () => {
        if (!resumeId) {
            setError("Upload your resume before starting.");
            return;
        }

        setIsStarting(true);
        setError(null);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/interview`,
                { resumeId, jobDescription },
                { withCredentials: true }
            );
            router.push("/interview/" + res.data.newInterview.id);
        } catch (e) {
            console.log("error creating interview", e);
            setError("Couldn't start the interview. Try again.");
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-indigo-50/40 via-white to-white px-6 py-10">
            <div className="mx-auto max-w-2xl">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-sm shadow-indigo-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.696L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
                        <p className="text-gray-500">
                            Upload your resume and add a job description to start a mock interview.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Resume upload */}
                <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm shadow-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H8.25m6-9v3.375c0 .621.504 1.125 1.125 1.125h3.375M9 12h.008v.008H9V12z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Resume</h2>
                        </div>
                        {resumeId && (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                Uploaded
                            </span>
                        )}
                    </div>

                    <label
                        htmlFor="resume-upload"
                        className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                            file
                                ? "border-indigo-300 bg-indigo-50/40"
                                : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30"
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${file ? "text-indigo-500" : "text-gray-300"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        <span className="mt-2 text-sm font-medium text-gray-700">
                            {file ? file.name : "Click to select a PDF or Word file"}
                        </span>
                        <span className="mt-1 text-xs text-gray-400">Max 5MB</span>
                        <input
                            id="resume-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    <button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className="mt-4 w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:bg-none disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                    >
                        {isUploading ? "Uploading..." : "Upload resume"}
                    </button>
                </div>

                {/* Job description */}
                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm shadow-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Job description</h2>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        Paste the role you're preparing for so the interview questions match it.
                    </p>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here..."
                        rows={5}
                        className="mt-4 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                {/* Start */}
                <button
                    onClick={handleStartInterview}
                    disabled={!resumeId || isStarting}
                    className="mt-6 w-full rounded-xl bg-linear-to-r from-gray-900 to-gray-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-gray-800 hover:to-gray-700 disabled:cursor-not-allowed disabled:bg-none disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                >
                    {isStarting ? "Starting interview..." : "Start interview"}
                </button>
            </div>
        </div>
    );
}