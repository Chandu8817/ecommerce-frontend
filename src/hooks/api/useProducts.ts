import { useState } from 'react';
import { apiRequest } from './apiConfig';
import { Product,AddProductData } from '../../types';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'rating' | 'createdAt' | 'featured';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  inStock?: boolean;
  ageGroup?: string;
  gender?: string;
  take?: number;
  skip?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}



export const useProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProducts = async (filters: ProductFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Convert filters to query parameters
      const queryParams = new URLSearchParams();
      
      // Add filters to query params if they exist
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else if (typeof value === 'object') {
            queryParams.append(key, JSON.stringify(value));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const queryString = queryParams.toString();
      const url = `/products${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiRequest(url) as unknown as PaginatedResponse<Product>;
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/products/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = async (filters: ProductFilters) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/products/filter', {
        method: 'POST',
        body: JSON.stringify(filters),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter products');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin only
  const addProduct = async (productData: AddProductData) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin only - bulk import
  const addProducts = async (products: any[]) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/products/bulk', {
        method: 'POST',
        body: JSON.stringify(products),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add products');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get products with pagination
  const getPaginatedProducts = async (page: number = 1, pageSize: number = 12, filters: Omit<ProductFilters, 'take' | 'skip'> = {}) => {
    const skip = (page - 1) * pageSize;
    return filterProducts({
      ...filters,
      take: pageSize,
      skip,
    });
  };
  const getTotalCount = async () => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/products/total-count');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get total count');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const deleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/products/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProducts = async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/products', {
        method: 'DELETE',
        body: JSON.stringify({ids:ids}),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete products');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const updateProduct = async (id: string, productData: any) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProducts = async (ids: string[], productData: any) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/products', {
        method: 'PUT',
        body: JSON.stringify({ ids, productData }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update products');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getProducts,
    getPaginatedProducts,
    getProduct,
    filterProducts,
    addProduct,
    addProducts,
    getTotalCount,
    deleteProduct,
    deleteProducts,
    updateProduct,
    updateProducts,
    loading,
    error,
  };
};

export default useProducts;
