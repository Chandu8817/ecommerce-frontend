import { useState } from 'react';
import { apiRequest } from './apiConfig';

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCart = async () => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/cart');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/cart', {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/cart/${productId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/cart', {
        method: 'DELETE',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loading,
    error,
  };
};

export default useCart;
