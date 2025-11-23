import { UseCase, CreateUseCaseDTO, UpdateUseCaseDTO } from '../types';
import { api, messages } from '../config';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

class UseCaseApiService {
  private async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || messages.errors.http(response.status));
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(messages.errors.unexpected);
    }
  }

  async getAllUseCases(): Promise<UseCase[]> {
    return this.fetchWithErrorHandling<UseCase[]>(
      `${api.baseUrl}${api.endpoints.useCases}`
    );
  }

  async getUseCaseById(id: string): Promise<UseCase> {
    return this.fetchWithErrorHandling<UseCase>(
      `${api.baseUrl}${api.endpoints.useCaseById(id)}`
    );
  }

  async createUseCase(useCaseData: CreateUseCaseDTO): Promise<UseCase> {
    return this.fetchWithErrorHandling<UseCase>(
      `${api.baseUrl}${api.endpoints.useCases}`,
      {
        method: 'POST',
        body: JSON.stringify(useCaseData),
      }
    );
  }

  async updateUseCase(id: string, updates: UpdateUseCaseDTO): Promise<UseCase> {
    return this.fetchWithErrorHandling<UseCase>(
      `${api.baseUrl}${api.endpoints.useCaseById(id)}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
  }

  async deleteUseCase(id: string): Promise<void> {
    await this.fetchWithErrorHandling<void>(
      `${api.baseUrl}${api.endpoints.useCaseById(id)}`,
      {
        method: 'DELETE',
      }
    );
  }
}

class AuthApiService {
  private async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || messages.errors.http(response.status));
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(messages.errors.unexpected);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.fetchWithErrorHandling<AuthResponse>(
      `${api.baseUrl}${api.endpoints.auth.login}`,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
  }
}

export const useCaseApi = new UseCaseApiService();
export const authApi = new AuthApiService();
