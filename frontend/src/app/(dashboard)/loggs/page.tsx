"use client"

import { useState, useEffect } from "react";
import axios from "axios";

const ratingStyles: Record<number, string> = {
    1: "bg-[#7f1d1d] text-white",
    2: "bg-[#dc2626] text-white",
    3: "bg-[#f87171] text-white",
    4: "bg-[#f59e0b] text-white",
    5: "bg-[#f59e0b] text-white",
    6: "bg-[#eab308] text-white",
    7: "bg-[#86efac] text-gray-900",
    8: "bg-[#22c55e] text-white",
    9: "bg-[#14b8a6] text-white",
    10: "bg-[#0f766e] text-white",
};

export default function Loggs() {

    const [loggs, setLoggs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(7);

    useEffect(() => {
        const fetchLoggs = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logg/`, { withCredentials: true });
                setLoggs(res.data.loggs);
            } catch (e) {
                console.error("Error fetching loggs:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchLoggs();
    }, [])

    const totalPages = Math.max(1, Math.ceil(loggs.length / limit));
    const visibleLoggs = loggs.slice((page - 1) * limit, page * limit);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Your Loggs</h1>
                <p className="text-gray-500 mt-1">A daily record of how things went.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse h-28" />
                    ))}
                </div>
            ) : loggs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                        <span className="text-indigo-600 text-xl">📝</span>
                    </div>
                    <p className="text-gray-900 font-medium">No logs yet</p>
                    <p className="text-gray-500 text-sm mt-1">Your daily logs will show up here once you start tracking.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {visibleLoggs.map((logg, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {new Date(logg.date).toLocaleDateString(undefined, {
                                            weekday: "short",
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </h3>
                                    <span
                                        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${ratingStyles[logg.rating] ?? "bg-indigo-100 text-indigo-700"}`}
                                    >
                                        {logg.rating}
                                    </span>
                                </div>

                                {logg.description && (
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {logg.description.replace(/\\n/g, "\n")}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-100 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-500 px-2">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}