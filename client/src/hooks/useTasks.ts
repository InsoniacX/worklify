import type { Task, User } from "@/types";
import { authFetch } from "@/utils/AuthFetch";
import { useEffect, useState } from "react";

interface TaskFilter {
    title?: string;
    status?: "todo" | "in progress" | "review" | "done";
    priority?: "low" | "medium" | "high";
    assignedTo?: User[];
    team?: string;
}

export const useTask = (filters: TaskFilter = {}, page: number = 1) => {
    const [ tasks, setTasks ] = useState<Task[]>([]);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<string | null>(null);
    const [ totalPages, setTotalPages ] = useState<number>(1);
    const [ total, setTotal ] = useState<number>(0);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();
                if (filters.title) params.append("title", filters.title);
                if (filters.status) params.append("status", filters.status);
                if (filters.priority) params.append("priority", filters.priority);
                if (filters.team) params.append("team", filters.team);
                params.append("page", String(page));
                params.append("limit", "10");

                const response = await authFetch(`http://localhost:8080/api/task?${params.toString()}`);
                if (!response.ok) throw new Error("Failed to Fetch Task!");

                const result = await response.json();
                setTasks(result.task);
                setTotal(result.total);
                setTotalPages(result.totalPages);
            } catch(err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchTask();
    }, [ filters.title, filters.team, filters.status, filters.priority ]);

    return { tasks, loading, error, totalPages, total }
}