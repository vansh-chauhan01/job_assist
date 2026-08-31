// components/RatingChart.tsx
"use client"

import { LineChart, Line, CartesianGrid, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface heatmap {
    date: string;
    rating: number;
    description: string;
}

interface RatingChartProps {
    heatmapData: heatmap[];
    maxStreak: number;
    averageRating: number;
}

const RatingTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-md shadow-lg">
                {payload[0].value}
            </div>
        );
    }
    return null;
};

export default function RatingChart({ heatmapData, maxStreak, averageRating }: RatingChartProps) {

    // sort by date ascending, since heatmapData order isn't guaranteed
    const trendData = [...heatmapData]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(log => ({
            date: log.date.split("T")[0],
            rating: log.rating,
        }));

    return (
        <>
            <div className="flex items-baseline gap-2 mt-2 mb-1">
                <p className="text-2xl font-bold text-gray-900">{maxStreak}</p>
                <p className="text-xs text-gray-700">day max streak</p>
                <p className="text-xs text-gray-700 ml-auto">avg {averageRating}</p>
            </div>

            <div className="flex-1 mt-1 min-h-0">
                {trendData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-gray-300">
                        No logs yet
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 10, right: 5, left: 0, bottom: 10 }}>
                            <CartesianGrid vertical={false} stroke="#f1f5f9" />
                            <YAxis
                                domain={[1, 10]}
                                ticks={[1, 10]}
                                tickLine={false}
                                axisLine={false}
                                width={20}
                                tick={{ fill: "#9ca3af", fontSize: 11 }}
                            />
                            <Tooltip content={<RatingTooltip />} cursor={{ stroke: "#e5e7eb" }} />
                            <Line
                                type="linear"
                                dataKey="rating"
                                stroke="#4F46E5"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: "#4F46E5", strokeWidth: 0 }}
                                activeDot={{ r: 5, fill: "#4F46E5" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </>
    );
}