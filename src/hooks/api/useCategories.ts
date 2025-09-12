import { useState } from 'react';
import { apiRequest } from './apiConfig';

export const useCategories = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/categories/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCategoryByName = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/categories/${encodeURIComponent(name)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category by name');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin functions
  const createCategory = async (categoryData: { name: string; description?: string; image?: string }) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, categoryData: { name?: string; description?: string; image?: string }) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/categories/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllCategories,
    getCategoryById,
    getCategoryByName,
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
    error,
  };
};

export default useCategories;
