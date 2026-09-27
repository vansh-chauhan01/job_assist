"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type PoorAnswer = {
    question: string;
    candidateAnswer: string;
    assessment: string;
    improvement: string;
};

type Evaluation = {
    overallScore: number;
    technicalKnowledge: number;
    problemSolving: number;
    communication: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    poorAnswers: PoorAnswer[];
    recommendations: string[];
};

export default function Summary() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<Evaluation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const getSummary = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/summary?interviewId=${id}`,
                    { withCredentials: true }
                );
                setData(res.data.summary);
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        getSummary();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-sm text-gray-400">Loading your results...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-sm text-gray-400">Couldn't load this summary. Try refreshing.</p>
            </div>
        );
    }

    const scoreColor = (score: number) => {
        if (score >= 8) return "text-emerald-600";
        if (score >= 5) return "text-amber-500";
        return "text-red-500";
    };

    return (
        <div className="min-h-screen bg-white px-6 py-10">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-900">Interview summary</h1>
                <p className="mt-2 text-gray-500">{data.summary}</p>

                {/* Scores */}
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <p className="text-xs font-medium text-gray-400">Overall</p>
                        <p className={`mt-1 text-3xl font-bold ${scoreColor(data.overallScore)}`}>
                            {data.overallScore}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <p className="text-xs font-medium text-gray-400">Technical</p>
                        <p className={`mt-1 text-3xl font-bold ${scoreColor(data.technicalKnowledge)}`}>
                            {data.technicalKnowledge}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <p className="text-xs font-medium text-gray-400">Problem solving</p>
                        <p className={`mt-1 text-3xl font-bold ${scoreColor(data.problemSolving)}`}>
                            {data.problemSolving}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <p className="text-xs font-medium text-gray-400">Communication</p>
                        <p className={`mt-1 text-3xl font-bold ${scoreColor(data.communication)}`}>
                            {data.communication}
                        </p>
                    </div>
                </div>

                {/* Strengths & weaknesses */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-sm font-semibold text-gray-900">Strengths</h2>
                        <ul className="mt-3 space-y-2">
                            {data.strengths.map((item, i) => (
                                <li key={i} className="flex gap-2 text-sm text-gray-600">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-sm font-semibold text-gray-900">Weaknesses</h2>
                        <ul className="mt-3 space-y-2">
                            {data.weaknesses.map((item, i) => (
                                <li key={i} className="flex gap-2 text-sm text-gray-600">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Poor answers */}
                {data.poorAnswers.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-sm font-semibold text-gray-900">Answers to revisit</h2>
                        <div className="mt-3 space-y-3">
                            {data.poorAnswers.map((item, i) => (
                                <div key={i} className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                                    <p className="text-sm font-medium text-gray-900">{item.question}</p>
                                    <p className="mt-2 text-sm text-gray-500">
                                        <span className="font-medium text-gray-700">Your answer: </span>
                                        {item.candidateAnswer}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-500">
                                        <span className="font-medium text-gray-700">Assessment: </span>
                                        {item.assessment}
                                    </p>
                                    <div className="mt-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
                                        {item.improvement}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                <div className="mt-6 rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-900">Recommendations</h2>
                    <ul className="mt-3 space-y-2">
                        {data.recommendations.map((item, i) => (
                            <li key={i} className="flex gap-2 text-sm text-gray-600">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    onClick={() => router.push("/dashboard")}
                    className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                    Back to dashboard
                </button>
            </div>
        </div>
    );
}