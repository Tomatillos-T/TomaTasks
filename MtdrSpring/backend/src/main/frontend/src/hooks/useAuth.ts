// hooks/useAuth.ts
import { useState } from 'react';
import authService from '../services/authService';
import type { LoginCredentials, RegisterData } from '../services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authService.login(credentials);
      setToken(response.token);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError('');
      
      const user = await authService.register(userData);
      
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    authService.logout();
  };

  return {
    login,
    register,
    logout,
    loading,
    error,
    token,
    isAuthenticated: !!token,
  };
};