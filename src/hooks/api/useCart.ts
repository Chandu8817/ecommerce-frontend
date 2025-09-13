import { useState, useEffect } from 'react';
import { apiRequest } from './apiConfig';
import { Product } from '../../types';
import { CartItem } from '../../types';
import { useCartContext } from '../../context/CartContext';



export const useCart = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCount, clearCartData } = useCartContext();


  // Load cart on mount
  useEffect(() => {
    getCart().catch(console.error);
  }, []);



  const getCart = async (): Promise<CartItem> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<CartItem>('/cart');


      return response as unknown as CartItem || {};
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<CartItem>('/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId: product._id,
          quantity,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || ''
        }),
      });


      setCount(response.items.length);
      return response as unknown as CartItem || {};
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      return removeFromCart(productId);
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`/cart/`, {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
      });


      setCount(response.items.length);
      return response as unknown as CartItem || {};
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
      await apiRequest(`/cart/${productId}`, {
        method: 'DELETE',
      });
      const response = await apiRequest<CartItem>('/cart');
      setCount(response.items.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest('/cart', {
        method: 'DELETE',
      });

      // Update local state
      clearCartData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
};

export default useCart;
