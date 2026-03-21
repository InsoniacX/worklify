import { useEffect, useState } from 'react';
import type { Product } from "@/types";
import { authFetch } from '@/utils/AuthFetch';

/**
 * Get all Products Data
 * METHOD: GET
 */
export const useProduct = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            const response = await authFetch("http://localhost:8080/api/product");
            if (!response.ok) return new Error("Failed to Fetch Products");
            const data: Product[] = await response.json();
            setProducts(data);
        } catch(err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchProducts(); }, []);

    return { products, loading, error, refetch: fetchProducts }
}

export const useRecentProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecentProducts = async () => {

            try {
                const response = await authFetch("http://localhost:8080/api/product/latest");
                if(!response.ok) throw new Error("Failed to fetch Recent Products")
                    const data: Product[] = await response.json();
                setProducts(data);
            } catch(err) {
                setError((err as Error).message)
            } finally {
                setLoading(false);
            }
        };

        fetchRecentProducts();
    }, [])

    return { products, loading, error };
}
