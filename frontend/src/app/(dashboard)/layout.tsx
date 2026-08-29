"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    MonitorCog ,
    CheckSquare,
    Building2,
    FileText,
    User,
    Sparkles,
    LogOut,
    Menu,
    X,
} from "lucide-react";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: MonitorCog },
    { label: "Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Applications", href: "/applications", icon: Building2 },
    { label: "Profile", href: "/profile", icon: User },
    { label: "AI Assistant", href: "/assistant", icon: Sparkles },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-[#0a0b0f]">
            {/* Overlay behind sidebar on mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-70 transform flex-col border-r border-gray-800 bg-[#0d0f14] px-4 py-6 transition-transform duration-200 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:static md:translate-x-0`}
            >
                {/* Logo row + close button (close only shows on mobile) */}
                <div className="mb-8 flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <div className="text-xl">🎯</div>
                        <span className="text-lg font-semibold text-white">
                            ApplyStack
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-md p-1 text-gray-400 hover:bg-white/5 hover:text-white md:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="mb-3 px-2 text-xs font-medium tracking-wide text-gray-500">
                    MENU
                </p>

                <nav className="flex flex-1 flex-col gap-1">
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
                                        ? "border-l-2 border-indigo-500 bg-white/5 font-medium text-white"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <Icon size={18} />
                                    {item.label}
                                </span>
                                {isActive && (
                                    <span className="text-gray-500">›</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <button className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:bg-white/5 hover:text-white">
                    <LogOut size={18} />
                    <span className="text-sm">Logout</span>
                </button>
            </aside>

            {/* Main column */}
            <div className="flex flex-1 flex-col">
                {/* Top bar — only really needed for the mobile hamburger */}
                <header className="flex items-center justify-between border-b border-gray-800 bg-[#0d0f14] px-4 py-3 md:hidden">
                    <div className="flex items-center gap-2">
                        <div className="text-xl">🎯</div>
                        <span className="text-lg font-semibold text-white">
                            ApplyStack
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-md bg-white/5 p-2 text-white"
                    >
                        <Menu size={20} />
                    </button>
                </header>

                <main className="flex-1 px-5 py-6 md:px-10 md:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}