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

  async get<T>(url: string) {
    const response = await this.client.get<ApiResponse<T>>(url);
    if (!response.data.success || response.data.data === undefined) {
      throw new Error(response.data.error || messages.errors.unexpected);
    }
    return response.data.data;
  }

  async post<T>(url: string, data?: any) {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    if (!response.data.success || response.data.data === undefined) {
      throw new Error(response.data.error || messages.errors.unexpected);
    }
    return response.data.data;
  }

  async put<T>(url: string, data?: any) {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    if (!response.data.success || response.data.data === undefined) {
      throw new Error(response.data.error || messages.errors.unexpected);
    }
    return response.data.data;
  }

  async delete<T>(url: string) {
    const response = await this.client.delete<ApiResponse<T>>(url);
    if (!response.data.success) {
      throw new Error(response.data.error || messages.errors.unexpected);
    }
    return response.data.data;
  }

  getInstance(): AxiosInstance {
    return this.client;
  }
}

const apiClient = new ApiClient();
const axiosInstance = apiClient.getInstance();

class UseCaseApiService {
  async getAllUseCases(): Promise<UseCase[]> {
    return apiClient.get<UseCase[]>(api.endpoints.useCases);
  }

  async getUseCaseById(id: string): Promise<UseCase> {
    return apiClient.get<UseCase>(api.endpoints.useCaseById(id));
  }

  async createUseCase(useCaseData: CreateUseCaseDTO): Promise<UseCase> {
    return apiClient.post<UseCase>(api.endpoints.useCases, useCaseData);
  }

  async updateUseCase(id: string, updates: UpdateUseCaseDTO): Promise<UseCase> {
    return apiClient.put<UseCase>(api.endpoints.useCaseById(id), updates);
  }

  async deleteUseCase(id: string): Promise<void> {
    await apiClient.delete<void>(api.endpoints.useCaseById(id));
  }
}

class AuthApiService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(api.endpoints.auth.login, credentials);
  }
}

export const useCaseApi = new UseCaseApiService();
export const authApi = new AuthApiService();
export { axiosInstance };
