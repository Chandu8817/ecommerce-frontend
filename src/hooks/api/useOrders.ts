import { useState } from 'react';
import { apiRequest } from './apiConfig';

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: any;
    paymentMethod: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/orders/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrdersByUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/orders/user/${userId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user orders');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrdersByStatus = async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/orders/status/${status}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders by status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/orders/${orderId}/cancel`, {
        method: 'PATCH',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin functions
  const filterOrders = async (filters: any) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/orders/filter', {
        method: 'POST',
        body: JSON.stringify(filters),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter orders');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSalesByProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/orders/sales');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sales by products');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTotalSales = async () => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/orders/total-sales');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch total sales');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMonthlySalesReport = async () => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/orders/monthly-sales');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch monthly sales report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    getOrders,
    getOrderById,
    getOrdersByUser,
    getOrdersByStatus,
    updateOrderStatus,
    cancelOrder,
    filterOrders,
    getSalesByProducts,
    getTotalSales,
    getMonthlySalesReport,
    loading,
    error,
  };
};

export default useOrders;
