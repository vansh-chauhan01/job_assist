"use client"

import { useState } from "react";
import axios from "axios";

interface LoggFormProps {
    date?: string;
    onSaved?: () => void;
}

const scoreColors = [
    "#7f1d1d", // 1
    "#dc2626", // 2
    "#f87171", // 3
    "#f59e0b", // 4
    "#f59e0b", // 5
    "#facc15", // 6
    "#86efac", // 7
    "#22c55e", // 8
    "#14b8a6", // 9
    "#115e59", // 10
];

export default function LoggForm({ date, onSaved }: LoggFormProps) {
    const [selectedDate, setSelectedDate] = useState(date ?? new Date().toISOString().split("T")[0]);
    const [rating, setRating] = useState<number | null>(null);
    const [note, setNote] = useState("");
    const [update, setUpdate] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    

    const handleSubmit = async () => {
        if (rating === null) return;

        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logg/`, {
                date: selectedDate,
                rating,
                description: note,
            }, { withCredentials: true });

            setSaved(true);
            setIsEditing(true);
            onSaved?.();
        } catch (e) {
            console.log("error saving log", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="mb-5">
                <h3 className="font-semibold text-lg">Log today</h3>
                {isEditing && (
                    <p className="text-sm text-gray-500 mt-0.5">Editing existing entry</p>
                )}
            </div>

            <div className="flex flex-wrap items-start gap-8 mb-6">
                <div>
                    <p className="text-xs font-medium tracking-wide text-gray-500 mb-2">DATE</p>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <p className="text-xs font-medium tracking-wide text-gray-500 mb-2">SCORE YOUR DAY</p>
                    <div className="flex gap-2 flex-wrap">
                        {scoreColors.map((color, i) => {
                            const value = i + 1;
                            const isSelected = rating === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRating(value)}
                                    className="w-11 h-11 rounded-lg font-semibold text-sm flex items-center justify-center transition-transform"
                                    style={{
                                        backgroundColor: color,
                                        color: value <= 6 ? "white" : "#1a1a1a",
                                        outline: isSelected ? "2px solid #111827" : "none",
                                        outlineOffset: isSelected ? "2px" : "0",
                                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                                    }}
                                >
                                    {value}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mb-5">
                <p className="text-xs font-medium tracking-wide text-gray-500 mb-2">NOTE</p>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="How did today go?"
                />
            </div>

           
            <button
                type="button"
                onClick={handleSubmit}
                disabled={rating === null || loading}
                className="w-full bg-gray-900 text-white font-semibold rounded-lg py-3 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? "Saving..." : isEditing ? "Update entry" : "Save entry"}
            </button>

            {saved && (
                <p className="text-sm text-emerald-600 mt-3">
                    Saved. You can edit this date again anytime.
                </p>
            )}
        </div>
    );
}