import { useState } from 'react';
import { apiRequest } from './apiConfig';
import { ShippingAddress, User } from '../../types';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (userData: { email: string; password: string; name: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<User>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem('token');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<User>('/auth/me');
      return data as unknown as User;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addShippingAddress = async (address: ShippingAddress) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest('/auth/shipping-address', {
        method: 'POST',
        body: JSON.stringify(address),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add shipping address');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getShippingAddress = async () =>  {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<ShippingAddress[]>('/auth/shipping-address');
      return data as unknown as ShippingAddress[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeShippingAddress = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(`/auth/shipping-address/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove shipping address');
      throw err;
    } finally {
      setLoading(false);
    }
  };

    const registerAdmin = async (userData: { email: string; password: string; name: string }) => {
    setLoading(true);
    setError(null);
    try {
      const userDataAdmin = { ...userData, role: "admin" }
      const data = await apiRequest<User>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userDataAdmin),
      });
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role',data.data.role);
      }
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  



  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };


  return {
    register,
    registerAdmin,
    loginAdmin,
    login,
    logout,
    getCurrentUser,
    addShippingAddress,
    getShippingAddress,
    removeShippingAddress,
    isAuthenticated,
    loading,
    error,
  };
};

export default useAuth;
