"use client";

type Props = {
    onClose: () => void;
};

export default function AddApplicationModal({ onClose }: Props) {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Background overlay */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-[500px] rounded-xl border border-gray-800 bg-[#0d0f14] p-6 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                        Add Application
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-xl"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form className="mt-6 space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Company *
                        </label>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Company name"
                                className="flex-1 rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-white outline-none focus:border-indigo-500"
                            />

                            <button
                                type="button"
                                className="rounded-lg border border-gray-700 px-3 text-gray-300"
                            >
                                Find Logo
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Role *
                        </label>

                        <input
                            type="text"
                            placeholder="Job role"
                            className="w-full rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-white outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Date
                        </label>

                        <input
                            type="date"
                            className="w-full rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Applied
                        </label>

                        <select
                            className="rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-white"
                        >
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Opening Type
                        </label>

                        <select
                            className="rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-white"
                        >
                            <option>Public</option>
                            <option>Referral</option>
                            <option>Internal</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Referral
                        </label>

                        <select
                            className="rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-white"
                        >
                            <option>Not Available</option>
                            <option>Available</option>
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