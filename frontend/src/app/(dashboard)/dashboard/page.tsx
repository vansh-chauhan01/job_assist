"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"


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


    const getColor = (rating: number | undefined) => {
        if (rating === undefined) return "#ebedf0";
        if (rating > 7) return "#4caf50";
        if (rating >= 5) return "#ff9800";
        return "#f44336";
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
                <h6 className="text-4xl font-bold">Dashboard</h6>
                <p className="mt-2.5">
                    hi {data?.userName}, Ready to make today count?
                </p>
            </div>

            <div className="mt-3 flex gap-4">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 w-80 h-60 ">
                    <p>Active Jobs Application</p>
                    <p>{data?.jobs.length}</p>
                    
                </div>

                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 w-80 h-60">
                    <p>Tasks Remaining</p>
                    <p>{data?.tasks.length}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 w-80 h-60">
                    <p>Daily Logs</p>
                    <p>Max Streak {maxStreak}</p>
                    <p>Average Rating {averageRating}</p>
                </div>
            </div>

            {/* cards */}
            <div>
                <div>

                </div>
            </div>


            {/* heatmap */}
            <div className="flex gap-3 sm:gap-4 overflow-x-auto py-2 px-1 pb-3">
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
        </div>
        
    )
}