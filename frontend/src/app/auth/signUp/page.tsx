"use client"
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!userName || !email || !password) {
            setError("Fill in all fields to continue.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signup`,
                { username: userName, email: email, password: password },
                { withCredentials: true }
            );
            router.push("/dashboard");
        } catch (e) {
            console.log("error signing up", e);
            setError("Couldn't create your account. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F7F3E7] px-6">
            <div className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
                <h1 className="font-serif text-3xl text-gray-900">Create your account</h1>
                <p className="mt-1 text-sm text-gray-500">Start your mock interviews with Orbit.</p>

                {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            onChange={(e) => setUserName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-purple-200 px-4 py-2.5 text-sm font-semibold text-purple-800 transition hover:bg-purple-300 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                    >
                        {isSubmitting ? "Creating account..." : "Sign up"}
                    </button>
                </div>
            </div>
        </div>
    );
}