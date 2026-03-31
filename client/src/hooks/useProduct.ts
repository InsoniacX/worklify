import { useEffect, useState } from 'react';
import type { Product } from "@/types";
import { authFetch } from '@/utils/AuthFetch';

// Product Filter Interface 
interface ProductFilters {
    name?: string;
    category?: string;
    stock?: string;
}

/**
 * Get all Products Data
 * METHOD: GET
 */
export const useProduct = (filters: ProductFilters = {}, page: number = 1) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();
                if (filters.name) params.append("name", filters.name);
                if (filters.category) params.append("category", filters.category);
                if (filters.stock) params.append("stock", filters.stock);
                params.append("page", String(page));
                params.append("limit", "5");

                const response = await authFetch(`http://localhost:8080/api/product?${params.toString()}`);
                if (!response.ok) throw new Error("Failed to fetch Data");

                const result = await response.json();
                setProducts(result.data);
                setTotal(result.total);
                setTotalPages(result.totalPages);
            } catch(err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [filters.name, filters.category, filters.stock, page]);

    return { products, loading, error, totalPages, total }
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
