import { api } from '../config';
import { apiClient } from './apiClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

class AuthApiService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(api.endpoints.auth.login, credentials);
  }
}

export const authApi = new AuthApiService();
