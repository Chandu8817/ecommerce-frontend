import { useState } from 'react';
import { apiRequest } from './apiConfig';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (userData: { email: string; password: string; name: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/auth/register', {
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
      return await apiRequest('/auth/me');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
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
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    loading,
    error,
  };
};

export default useAuth;
