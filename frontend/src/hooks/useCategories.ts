import { useState, useEffect } from 'react';
import { Category } from '../types/market';
import { fetchCategories } from '../services/coinService';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load categories'));
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []);

    return { categories, isLoading, error };
};
