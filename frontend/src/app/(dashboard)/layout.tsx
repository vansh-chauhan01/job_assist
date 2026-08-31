"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    MonitorCog,
    CheckSquare,
    Building2,
    FileText,
    User,
    Sparkles,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import axios from "axios";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: MonitorCog },
    { label: "Applications", href: "/jobApplication", icon: Building2 },
    { label: "Tasks", href: "/tasks", icon: CheckSquare },
    { label: "AI Assistant", href: "/assistant", icon: Sparkles },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const router = useRouter();

    const handleLogout = async()=>{
        try{
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout` , { withCredentials : true });
            router.push("/auth/signIn");
        }catch(e){

        }
    }


    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Overlay behind sidebar on mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 sm:w-72 h-screen transform flex-col border-r border-gray-200 bg-white px-4 py-6 transition-transform duration-200 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:static md:translate-x-0 md:w-64 md:h-auto`}
            >
                {/* Logo row + close button (close only shows on mobile) */}
                <div className="mb-8 flex items-center justify-between px-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="text-xl shrink-0">🎯</div>
                        <span className="truncate text-2xl font-semibold text-gray-900">
                            JobAssist
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 md:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="mb-3 px-2 text-xs font-medium tracking-wide text-gray-400">
                    MENU
                </p>

                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                                    isActive
                                        ? "border-l-2 border-indigo-500 bg-indigo-50 font-medium text-indigo-700"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                                <span className="flex min-w-0 items-center gap-3">
                                    <Icon size={18} className="shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                </span>
                                {isActive && (
                                    <span className="shrink-0 text-indigo-400">›</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <button onClick={handleLogout} className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                    <LogOut size={18} className="shrink-0" />
                    <span className="text-sm">Logout</span>
                </button>
            </aside>

            {/* Main column */}
            <div className="flex min-w-0 flex-1 flex-col md:ml-0 overflow-hidden">
                {/* Top bar — only really needed for the mobile hamburger */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="text-xl shrink-0">🎯</div>
                        <span className="truncate text-lg font-semibold text-gray-900">
                            JobAssist
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="shrink-0 rounded-md bg-gray-100 p-2 text-gray-700"
                    >
                        <Menu size={20} />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-8">
                    {children}
                </main>
            </div>

        </div>
    );
}