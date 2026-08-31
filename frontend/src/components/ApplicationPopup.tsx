"use client";

import axios from "axios";
import { useState, useEffect } from "react";

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
    job?: Job;                              // pass this to edit an existing job
    onClose: () => void;
    onJobAdded: (job: Job) => void;
    onJobUpdated?: (job: Job) => void;
};

export default function AddApplicationModal({
    job,
    onClose,
    onJobAdded,
    onJobUpdated,
}: Props) {
    const isEditing = Boolean(job?.id);

    const [formData, setFormData] = useState<Job>({
        companyName: job?.companyName ?? "",
        role: job?.role ?? "",
        remote: job?.remote ?? false,
        referral: job?.referral ?? false,
        openingType: job?.openingType ?? "On Campus",
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing) {
                const updated = await axios.put(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/job/${job!.id}`,
                    formData,
                    { withCredentials: true }
                );

                onJobUpdated?.(updated.data.job);
            } else {
                const addJob = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/job`,
                    formData,
                    { withCredentials: true }
                );

                onJobAdded(addJob.data.newJob);
            }

            onClose();
        } catch (e) {
            console.log("error", e);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative z-10 w-125 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isEditing ? "Edit Application" : "Add Application"}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl text-gray-400 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Company *
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            placeholder="Company name"
                            value={formData.companyName ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Role *
                        </label>
                        <input
                            type="text"
                            name="role"
                            placeholder="Job role"
                            value={formData.role ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Remote
                        </label>
                        <select
                            name="remote"
                            value={String(formData.remote)}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Type Of Opening
                        </label>
                        <select
                            name="openingType"
                            value={formData.openingType}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="On Campus">On Campus</option>
                            <option value="Off Campus">Off Campus</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Referral
                        </label>
                        <select
                            name="referral"
                            value={String(formData.referral)}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="false">Not Available</option>
                            <option value="true">Available</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-5 py-2 text-white font-medium hover:bg-indigo-700 transition-colors"
                        >
                            {isEditing ? "Save Changes" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}