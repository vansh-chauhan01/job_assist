"use client"
import AddApplicationModal from "@/components/ApplicationPopup";
import axios from "axios";
import { useEffect, useState } from "react"
import { Building2, Plus, Trash2, MapPin, Users, Pencil } from "lucide-react";

interface job {
    id?: number,
    userId?: number,
    companyName?: string,
    role?: string,
    referral?: boolean,
    remote?: boolean,
    openingType?: string
}

export default function jobApplication() {

    const [popUp, setPopUp] = useState(false);
    const [jobData, setJobData] = useState<job[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingJob, setEditingJob] = useState<job | null>(null);
    const [failedLogos, setFailedLogos] = useState<Set<number>>(new Set());

    const getLogoUrl = (companyName: string) => {
        const domain = companyName.toLowerCase().replace(/\s+/g, "") + ".com";
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    };

    useEffect(() => {
        const getJobData = async () => {
            try {
                const jobsData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/job/`, { withCredentials: true });
                setJobData(Array.isArray(jobsData.data.jobs) ? jobsData.data.jobs : []);
            } catch (e) {
                console.log("couldnt fetch job");
            } finally {
                setLoading(false);
            }
        }
        getJobData();

    }, [])

    const handleDelete = async (jobId?: number) => {
        if (!jobId) return;

        setDeletingId(jobId);
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/job/${jobId}`, { withCredentials: true });
            setJobData(prev => prev.filter(job => job.id !== jobId));
        } catch (e) {
            console.log("couldnt delete job");
        } finally {
            setDeletingId(null);
        }
    };

    const closeModal = () => {
        setPopUp(false);
        setEditingJob(null);
    };

    return (
        <div className="max-w-6xl mx-auto px-4">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Applications</h1>
                    <p className="mt-2 text-sm sm:text-base text-gray-500">Track every role you've applied to</p>
                </div>

                <button
                    onClick={() => setPopUp(true)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                >
                    <Plus size={18} />
                    Add Application
                </button>
            </div>

            {loading ? (
                <p className="text-gray-400 text-sm">Loading applications...</p>
            ) : jobData.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-12 text-center">
                    <Building2 size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No applications yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add your first one to start tracking</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobData.map((element) => {
                        const logoFailed = !element.id || failedLogos.has(element.id);

                        return (
                            <div
                                key={element.id}
                                className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6 relative"
                            >
                                <div className="absolute top-4 right-4 flex gap-3">
                                    <button
                                        onClick={() => setEditingJob(element)}
                                        className="text-gray-500 hover:text-indigo-600 transition-colors"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(element.id)}
                                        disabled={deletingId === element.id}
                                        className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-50 flex items-center justify-center mb-4 overflow-hidden">
                                    {!logoFailed && element.companyName ? (
                                        <img
                                            src={getLogoUrl(element.companyName)}
                                            alt={element.companyName}
                                            className="w-full h-full object-contain"
                                            onError={() => {
                                                setFailedLogos(prev => new Set(prev).add(element.id!));
                                            }}
                                        />
                                    ) : (
                                        <Building2 size={18} className="text-indigo-600" />
                                    )}
                                </div>

                                <p className="font-semibold text-gray-900 pr-14 truncate">{element.companyName}</p>
                                <p className="text-sm text-gray-500 mt-0.5 truncate">{element.role}</p>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                                        <MapPin size={12} />
                                        {element.remote ? "Remote" : "On-site"}
                                    </span>
                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                                        {element.openingType}
                                    </span>
                                    {element.referral && (
                                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
                                            <Users size={12} />
                                            Referral
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {(popUp || editingJob) && (
                <AddApplicationModal
                    job={editingJob ?? undefined}
                    onClose={closeModal}
                    onJobAdded={(newJob) => { setJobData(prev => [...prev, newJob]) }}
                    onJobUpdated={(updatedJob) => {
                        setJobData(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
                    }}
                />
            )}

        </div>
    )
}