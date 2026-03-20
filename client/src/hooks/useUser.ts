import { useEffect, useState } from 'react';
import type { User } from "@/types";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/user");
            if (!response.ok) return new Error("Failed to Fetch users");
            const data: User[] = await response.json();
            setUsers(data);
        } catch(err) {                      
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, [])

    return { users, loading, error, refetch: fetchUsers };
}

export const useRecentUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecentUsers = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/user/recent');
                if(!response.ok) throw new Error("Failed to Fetch Recent Users");
                const data: User[] = await response.json();
                setUsers(data);
            } catch(err) {
                setError((err as Error).message)
            } finally {
                setLoading(false)
            }
        };

        fetchRecentUsers();
    }, []);

    return { users, loading, error};
}