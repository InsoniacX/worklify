import { useEffect, useState } from 'react';
import type { User } from "@/types";
import { authFetch } from '@/utils/AuthFetch';

/**
 * Get all Users Data
 * METHOD: GET
 */
export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await authFetch("http://localhost:8080/api/user");
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

/**
 * Find the recent created User
 * METHOD: GET
 */
export const useRecentUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecentUsers = async () => {
            try {
                const response = await authFetch('http://localhost:8080/api/user/recent');
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

/**
 * Count User in a Month
 * METHOD: GET
 */
export const useUserCount = () => {
    const [count, setCount] = useState<number>(0);
    const [delta, setDelta] = useState<number>(0);
    const [deltaUp, setDeltaUp] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await authFetch("http://localhost:8080/api/user/count");
                if (!response.ok) throw new Error("Failed to get User Count");
                const data = await response.json();
                setCount(data.count);
                setDelta(data.delta);
                setDeltaUp(data.deltaUp);
            } catch(error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        };

        fetchCount();
    }, [])

    return { count, loading, delta, deltaUp };
}

