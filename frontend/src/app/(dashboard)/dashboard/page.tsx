"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import LoggForm from "@/components/LoggForm";
import RatingChart from "@/components/RatingGraph";
import { Building2, CheckSquare, Flame } from "lucide-react";


interface heatmap {
    date: string,
    rating: number,
    description: string
}


interface UserData {
    id: number;
    userName: string;
    email: string;
    createdAt: string;
    jobs: {
        id: number;
        userId: number;
        companyName: string;
        role: string;
        referral: boolean;
        remote: boolean;
        openingType: string;
        createdAt: string;
    }[];
    tasks: {
        id: number;
        title: string;
        userId: number;
    }[];
}


export default function dashBoard() {

    const router = useRouter();

    const [data, setData] = useState<UserData | null>();
    const [heatmapData, setHeatmapData] = useState<heatmap[]>([]);


    const sendToTaskPage = () => {
        router.push("/tasks")
    }


    const getHeatMap = async () => {
        try {
            const heatMapData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logg/heatmap`, { withCredentials: true });
            setHeatmapData(heatMapData.data.loggs)
        } catch (e) {
            console.log("error", e);
        }
    }


    useEffect(() => {
        const getData = async () => {
            try {
                const userData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/`, { withCredentials: true });
                setData(userData.data.currUser);
            } catch (e) {
                console.log("error fetching user data", e);
            }
        }



        getHeatMap();
        getData();
    }, [])

    const logsByDate = heatmapData.reduce((acc, log) => {
        const key = log.date.split("T")[0];
        acc[key] = log;
        return acc;
    }, {} as Record<string, heatmap>);


    const generateDateRange = (days: number) => {
        const dates: string[] = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split("T")[0]);
        }

        return dates;
    };


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

    const getColor = (rating: number | undefined) => {
        if (rating === undefined) return "#ebedf0";
        return scoreColors[rating - 1] ?? "#ebedf0";
    };


    const groupByMonth = (dates: string[]) => {
        const months: Record<string, string[]> = {};

        dates.forEach((dateStr) => {
            const monthKey = dateStr.slice(0, 7);
            if (!months[monthKey]) months[monthKey] = [];
            months[monthKey].push(dateStr);
        });

        return months;
    };


    const monthLabel = (monthKey: string) => {
        const [year, month] = monthKey.split("-");
        return new Date(Number(year), Number(month) - 1).toLocaleString("default", { month: "short" });
    };

    const groupMonthIntoWeeks = (dates: string[]) => {
        const weeks: string[][] = [];
        let currentWeek: string[] = [];

        dates.forEach((dateStr, index) => {
            const dayOfWeek = new Date(dateStr).getDay();

            if (index === 0) {
                for (let i = 0; i < dayOfWeek; i++) currentWeek.push("");
            }

            currentWeek.push(dateStr);

            if (dayOfWeek === 6 || index === dates.length - 1) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });

        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) currentWeek.push("");
            weeks.push(currentWeek);
        }

        return weeks;
    };

    const getMaxStreak = (dates: string[], logsByDate: Record<string, heatmap>) => {
        let maxStreak = 0;
        let currentStreak = 0;

        for (const date of dates) {
            if (logsByDate[date]) {
                currentStreak += 1;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }

        return maxStreak;
    };


    const getAverageRating = (logs: heatmap[]) => {
        if (logs.length === 0) return 0;

        const total = logs.reduce((sum, log) => sum + log.rating, 0);
        return Math.round((total / logs.length) * 10) / 10;
    };


    const allDates = generateDateRange(365);
    const monthGroups = groupByMonth(allDates);
    const maxStreak = getMaxStreak(allDates, logsByDate);
    const averageRating = getAverageRating(heatmapData);


    return (
        <div className="max-w-4.5xl mx-auto px-4">

            <div className="mb-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Dashboard</h1>
                <p className="mt-2.5 text-sm sm:text-base">
                    hi {data?.userName}, Ready to make today count?
                </p>
            </div>


            <div className="mt-3 flex flex-col sm:flex-row gap-4">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 w-full sm:flex-1 h-56 sm:h-60 flex flex-col">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">Active Job Applications</p>
                        <div className="w-9 h-9 shrink-0 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Building2 size={18} className="text-indigo-600" />
                        </div>
                    </div>
                    <div className="mt-auto">
                        <p className="text-3xl sm:text-4xl font-bold text-gray-900">{data?.jobs.length ?? 0}</p>
                        <p className="text-xs text-gray-400 mt-1">applications tracked</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 w-full sm:flex-1 h-56 sm:h-60 flex flex-col">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">Tasks Remaining</p>
                        <div className="w-9 h-9 shrink-0 rounded-full bg-amber-50 flex items-center justify-center">
                            <CheckSquare size={18} className="text-amber-600" />
                        </div>
                    </div>
                    <div className="mt-auto">
                        <p className="text-3xl sm:text-4xl font-bold text-gray-900">{data?.tasks.length ?? 0}</p>
                        <p className="text-xs text-gray-400 mt-1">to complete</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 w-full sm:flex-1 h-56 sm:h-60 flex flex-col">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">Daily Logs</p>
                        <div className="w-9 h-9 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center">
                            <Flame size={18} className="text-emerald-600" />
                        </div>
                    </div>

                    <RatingChart
                        heatmapData={heatmapData}
                        maxStreak={maxStreak}
                        averageRating={averageRating}
                    />
                </div>
            </div>




            {/* heatmap */}
            <div className="mt-7 mb-10 flex gap-2 sm:gap-4 overflow-x-auto p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl shadow-md">
                {Object.entries(monthGroups).map(([monthKey, dates]) => {
                    const weeks = groupMonthIntoWeeks(dates);
                    return (
                        <div key={monthKey} className="flex-none">
                            <div className="text-[10px] sm:text-xs mb-1 text-gray-500">
                                {monthLabel(monthKey)}
                            </div>
                            <div className="flex gap-[2px] sm:gap-[3px]">
                                {weeks.map((week, wi) => (
                                    <div key={wi} className="flex flex-col gap-[2px] sm:gap-[3px]">
                                        {week.map((dateStr, di) => (
                                            <div
                                                key={di}
                                                title={dateStr || undefined}
                                                className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-sm"
                                                style={{
                                                    backgroundColor: dateStr ? getColor(logsByDate[dateStr]?.rating) : "transparent",
                                                }}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <LoggForm onSaved={getHeatMap} />

        </div>

    )
}