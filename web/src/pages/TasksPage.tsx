import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppAuth } from "../hooks/useAppAuth";
import { getTaskLists, getTasksForLists } from "../services/tasksService";

export function TasksPage() {
    const navigate = useNavigate();
    const auth = useAppAuth();
    const [data, setData] = useState<any>(null);

    const handleGetTaskLists = async () => {
        if (!auth.user?.access_token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            const lists = await getTaskLists(auth.user.access_token);
            setData(lists);
            toast.success("Fetched task lists successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch task lists");
        }
    };

    const handleGetTasksForLists = async () => {
        if (!auth.user?.access_token) {
            toast.error("Not authenticated");
            return;
        }
        try {
            const listsResponse = await getTaskLists(auth.user.access_token);
            if (!listsResponse.items || listsResponse.items.length === 0) {
                toast.error("No task lists found");
                return;
            }
            
            const tasks = await getTasksForLists(auth.user.access_token, listsResponse.items);
            setData(tasks);
            toast.success("Fetched tasks for lists successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch tasks");
        }
    };

    return (
        <div className="page-container">
            <button
                type="button"
                className="history-back-button"
                onClick={() => navigate("/")}
            >
                &lt; Back
            </button>
            <h1 className="page-title">Tasks</h1>
            <div className="flex gap-4 mb-4">
                <button 
                    onClick={handleGetTaskLists}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm transition-colors"
                >
                    Get Task Lists
                </button>
                <button 
                    onClick={handleGetTasksForLists}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow-sm transition-colors"
                >
                    Get Tasks for All Lists
                </button>
            </div>
            {data && (
                <div className="bg-slate-100 p-4 rounded overflow-auto max-h-[500px] border border-slate-200">
                    <pre className="text-sm text-slate-800">{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
