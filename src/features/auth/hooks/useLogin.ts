import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@entities/auth/api/authApi';
import { useAuthStore } from '@entities/auth/model/store';

export const useLogin = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const login = async (username: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authApi.login({ username, password });
      setToken(response.token, rememberMe);
      navigate('/products');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        const apiError = err as { response?: { data?: { message?: string } } };
        setError(apiError.response?.data?.message || 'Ошибка авторизации');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
};
