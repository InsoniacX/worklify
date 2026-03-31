import { useEffect, useState } from 'react';
import type { User } from "@/types";
import { authFetch } from '@/utils/AuthFetch';

// UserFilter Interface
interface UserFilters {
    name?: string;
    email?: string;
}

/**
 * Get all Users Data and Filter it Using Search
 * METHOD: GET
 */
export const useUsers = (filters: UserFilters = {}, page: number = 1 ) => {
    const [ users, setUsers ] = useState<User[]>([]);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<string | null>(null);
    const [ totalPages, setTotalPages ] = useState<number>(1);
    const [ total, setTotal ] = useState<number>(0);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();
                if (filters.name) params.append("name", filters.name);
                if (filters.email) params.append("email", filters.email);
                params.append("page", String(page));
                params.append("limit", "5");

                const response = await authFetch(`http://localhost:8080/api/user?${params.toString()}`);
                if (!response.ok) throw new Error("Failed to fetch users!");
                
                const result = await response.json();
                setUsers(result.data);
                setTotal(result.total);
                setTotalPages(result.totalPages);
            } catch(err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [filters.name, filters.email, page]);

    return { users, loading, error, totalPages, total };
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

