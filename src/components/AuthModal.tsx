import React, { useState } from 'react';
import { useAuth } from '../hooks/api/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const { login, register, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'signin') {
      const user =  await login({
          email: formData.email,
          password: formData.password
        });
        console.log(user)
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 font-medium ${mode === 'signin' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500'}`}
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
          <button
            className={`py-2 px-4 font-medium ${mode === 'signup' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500'}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gradient-to-br from-orange-600 to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading
              ? 'Processing...'
              : mode === 'signin'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-orange-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-orange-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;