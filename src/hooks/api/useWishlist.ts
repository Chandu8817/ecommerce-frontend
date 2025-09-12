import { useState } from 'react';
import { apiRequest } from './apiConfig';

export const useWishlist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/wishlist');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wishlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to wishlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/wishlist/${productId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from wishlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/wishlist', {
        method: 'DELETE',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear wishlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    loading,
    error,
  };
};

export default useWishlist;
