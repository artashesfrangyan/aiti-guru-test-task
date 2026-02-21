import { apiClient } from '@shared/api/client';
import { LoginRequest, LoginResponse } from '../model/types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return data;
  },
  
  checkAuth: async (): Promise<{ authenticated: boolean }> => {
    try {
      await apiClient.get('/auth/me');
      return { authenticated: true };
    } catch {
      return { authenticated: false };
    }
  },
};
