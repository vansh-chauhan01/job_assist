"use client";

import axios from "axios";
import { useState } from "react";

interface Job {
    id?: number;
    userId?: number;
    companyName?: string;
    role?: string;
    referral?: boolean;
    remote?: boolean;
    openingType?: string;
}

type Props = {
    onClose: () => void;
    onJobAdded: (job: Job) => void;
};

export default function AddApplicationModal({
    onClose,
    onJobAdded,
}: Props) {
    const [formData, setFormData] = useState<Job>({
        companyName: "",
        role: "",
        remote: false,
        referral: false,
        openingType: "On Campus",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "remote" || name === "referral"
                    ? value === "true"
                    : value,
        }));
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        console.log("Submitting:", formData);

        try {
            const addJob = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/job`,
                formData,
                {
                    withCredentials: true,
                }
            );

            onJobAdded(addJob.data.newJob);
            onClose();
        } catch (e) {
            console.log("error", e);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background overlay */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-125 rounded-xl border border-gray-800 bg-[#0d0f14] p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                        Add Application
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl text-gray-400 hover:text-white"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >
                    {/* Company */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                            Company *
                        </label>

                        <input
                            type="text"
                            name="companyName"
                            placeholder="Company name"
                            value={formData.companyName ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-white outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                            Role *
                        </label>

                        <input
                            type="text"
                            name="role"
                            placeholder="Job role"
                            value={formData.role ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-white outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Remote */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                            Remote
                        </label>

                        <select
                            name="remote"
                            value={String(formData.remote)}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-white"
                        >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>

                    {/* Type Of Opening */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                            Type Of Opening
                        </label>

                        <select
                            name="openingType"
                            value={formData.openingType}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-white"
                        >
                            <option value="On Campus">On Campus</option>
                            <option value="Off Campus">Off Campus</option>
                        </select>
                    </div>

                    {/* Referral */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                            Referral
                        </label>

                        <select
                            name="referral"
                            value={String(formData.referral)}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-white"
                        >
                            <option value="false">Not Available</option>
                            <option value="true">Available</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-700 px-4 py-2 text-gray-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-5 py-2 text-white"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}