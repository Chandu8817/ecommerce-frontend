import { useState } from 'react';
import { apiRequest } from './apiConfig';
import { Order } from '../../types';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentOrder = async (amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<Order>('/payment/create', {
        method: 'POST',
        body: JSON.stringify({amount:Math.round(amount * 100)}),
      });
      return data as unknown as Order ;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (razorpay_order_id:string, razorpay_payment_id:string, razorpay_signature:string, orderData:any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<Order>('/payment/verify', {
        method: 'POST',
        body: JSON.stringify({razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData}),
      });

      return data as unknown as Order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };



  return {
    createPaymentOrder,
    verifyPayment,
    loading,
    error,
  };
};

export default usePayment;
