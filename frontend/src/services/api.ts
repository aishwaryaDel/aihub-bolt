import axios, { AxiosInstance, AxiosError } from 'axios';
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
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: api.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse<unknown>>) => {
        if (error.response?.data?.error) {
          throw new Error(error.response.data.error);
        } else if (error.response?.status) {
          throw new Error(messages.errors.http(error.response.status));
        } else {
          throw new Error(messages.errors.unexpected);
        }
      }
    );
  }

  getInstance(): AxiosInstance {
    return this.client;
  }
}

const apiClient = new ApiClient();
const axiosInstance = apiClient.getInstance();

class UseCaseApiService {
  async getAllUseCases(): Promise<UseCase[]> {
    const response = await axiosInstance.get<ApiResponse<UseCase[]>>(
      api.endpoints.useCases
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || messages.errors.loadUseCases);
    }

    return response.data.data;
  }

  async getUseCaseById(id: string): Promise<UseCase> {
    const response = await axiosInstance.get<ApiResponse<UseCase>>(
      api.endpoints.useCaseById(id)
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || messages.errors.loadUseCases);
    }

    return response.data.data;
  }

  async createUseCase(useCaseData: CreateUseCaseDTO): Promise<UseCase> {
    const response = await axiosInstance.post<ApiResponse<UseCase>>(
      api.endpoints.useCases,
      useCaseData
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || messages.errors.saveUseCase);
    }

    return response.data.data;
  }

  async updateUseCase(id: string, updates: UpdateUseCaseDTO): Promise<UseCase> {
    const response = await axiosInstance.put<ApiResponse<UseCase>>(
      api.endpoints.useCaseById(id),
      updates
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || messages.errors.saveUseCase);
    }

    return response.data.data;
  }

  async deleteUseCase(id: string): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      api.endpoints.useCaseById(id)
    );

    if (!response.data.success) {
      throw new Error(response.data.error || messages.errors.deleteUseCase);
    }
  }
}

class AuthApiService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      api.endpoints.auth.login,
      credentials
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || messages.errors.loginFailed);
    }

    return response.data.data;
  }
}

export const useCaseApi = new UseCaseApiService();
export const authApi = new AuthApiService();
export { axiosInstance };
