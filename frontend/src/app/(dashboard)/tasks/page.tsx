"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { Check, Trash2, Pencil, X, Plus } from "lucide-react"

type task = {
    id: number,
    title: string,
    userId: number,
    completed: boolean
}

export default function tasks() {

    const [task, setTask] = useState<task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        const getTask = async () => {
            try {
                const exsistingTask = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/task`, { withCredentials: true });
                setTask(Array.isArray(exsistingTask.data.tasks) ? exsistingTask.data.tasks : []);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }

        getTask();
    }, [])

    const handleAddNewTask = async () => {
        if (!newTask.trim()) return;

        setAdding(true);
        try {
            const addTask = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/task`, { title: newTask, completed: false }, { withCredentials: true });
            const data = addTask.data.newTask;

            if (data?.id && data?.title) {
                setTask(prev => [...prev, data]);
                setNewTask("");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setAdding(false);
        }
    }

    // safely merges an updated task into state — never lets a bad/empty
    // response overwrite a task with missing data
    const mergeUpdatedTask = (id: number, updated: Partial<task> | undefined, fallback: task) => {
        if (!updated || !updated.title) {
            console.log("update response missing expected fields, keeping local state", updated);
            return;
        }
        setTask(prev => prev.map(item => item.id === id ? { ...fallback, ...updated } : item));
    }

    const handleToggleComplete = async (t: task) => {
        setTogglingId(t.id);
        try {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/task/${t.id}`,
                { completed: !t.completed },
                { withCredentials: true }
            );
            mergeUpdatedTask(t.id, res.data.updatedTask, t);
        } catch (e) {
            console.log(e);
        } finally {
            setTogglingId(null);
        }
    }

    const startEditing = (t: task) => {
        setEditingId(t.id);
        setEditValue(t.title);
    }

    const cancelEditing = () => {
        setEditingId(null);
        setEditValue("");
    }

    const saveEdit = async (t: task) => {
        if (!editValue.trim()) return;

        try {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/task/${t.id}`,
                { title: editValue },
                { withCredentials: true }
            );
            mergeUpdatedTask(t.id, res.data.updatedTask, t);
        } catch (e) {
            console.log(e);
        } finally {
            setEditingId(null);
            setEditValue("");
        }
    }

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/task/${id}`, { withCredentials: true });
            setTask(prev => prev.filter(item => item.id !== id));
        } catch (e) {
            console.log(e);
        } finally {
            setDeletingId(null);
        }
    }

    // incomplete tasks first, completed tasks sink to the bottom
    const sortedTasks = [...task].sort((a, b) => Number(a.completed) - Number(b.completed));

    return (
        <div className="max-w-3xl mx-auto px-4">

            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Tasks</h1>
                <p className="mt-2 text-sm sm:text-base text-gray-500">Keep track of what needs doing</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6">

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Add a new task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddNewTask()}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    <button
                        onClick={handleAddNewTask}
                        disabled={adding || !newTask.trim()}
                        className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto shrink-0"
                    >
                        <Plus size={16} />
                        Add
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-400 text-sm">Loading tasks...</p>
                ) : sortedTasks.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No tasks yet</p>
                        <p className="text-sm text-gray-400 mt-1">Add one above to get started</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {sortedTasks.map((t) => (
                            <li
                                key={t.id}
                                className="flex items-center gap-2 sm:gap-3 py-3 group"
                            >
                                <button
                                    onClick={() => handleToggleComplete(t)}
                                    disabled={togglingId === t.id}
                                    className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        t.completed
                                            ? "bg-emerald-500 border-emerald-500"
                                            : "border-gray-300 hover:border-indigo-400"
                                    }`}
                                >
                                    {t.completed && <Check size={12} className="text-white" strokeWidth={3} />}
                                </button>

                                {editingId === t.id ? (
                                    <div className="flex-1 flex items-center gap-2 min-w-0">
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveEdit(t);
                                                if (e.key === "Escape") cancelEditing();
                                            }}
                                            autoFocus
                                            className="flex-1 min-w-0 rounded-md border border-indigo-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                                        />
                                        <button
                                            onClick={() => saveEdit(t)}
                                            className="shrink-0 text-emerald-500 hover:text-emerald-600"
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="shrink-0 text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p
                                            className={`flex-1 min-w-0 text-sm transition-all truncate ${
                                                t.completed
                                                    ? "line-through text-gray-300 font-normal"
                                                    : "text-gray-900 font-medium"
                                            }`}
                                        >
                                            {t.title}
                                        </p>

                                        <div className="flex items-center gap-3 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEditing(t)}
                                                className="text-gray-500 hover:text-indigo-500 transition-colors"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                disabled={deletingId === t.id}
                                                className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

            </div>

        </div>
    )
}