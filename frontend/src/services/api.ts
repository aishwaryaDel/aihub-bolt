import axios, { AxiosInstance, AxiosError } from 'axios';
import { UseCase, CreateUseCaseDTO, UpdateUseCaseDTO } from '../types';
import { messages } from '../config';
import { API_ROUTES, getFullApiUrl } from '../routes/routes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      baseURL: API_BASE_URL,
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
      API_ROUTES.USE_CASES.BASE
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || messages.errors.loadUseCases);
    }

    return response.data.data;
  }

  async getUseCaseById(id: string): Promise<UseCase> {
    const response = await axiosInstance.get<ApiResponse<UseCase>>(
      API_ROUTES.USE_CASES.BY_ID(id)
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || messages.errors.loadUseCases);
    }

    return response.data.data;
  }

  async createUseCase(useCaseData: CreateUseCaseDTO): Promise<UseCase> {
    const response = await axiosInstance.post<ApiResponse<UseCase>>(
      API_ROUTES.USE_CASES.BASE,
      useCaseData
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || messages.errors.saveUseCase);
    }

    return response.data.data;
  }

  async updateUseCase(id: string, updates: UpdateUseCaseDTO): Promise<UseCase> {
    const response = await axiosInstance.put<ApiResponse<UseCase>>(
      API_ROUTES.USE_CASES.BY_ID(id),
      updates
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || messages.errors.saveUseCase);
    }

    return response.data.data;
  }

  async deleteUseCase(id: string): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      API_ROUTES.USE_CASES.BY_ID(id)
    );

    if (!response.data.success) {
      throw new Error(response.data.error || messages.errors.deleteUseCase);
    }
  }
}

class AuthApiService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ROUTES.AUTH.LOGIN,
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
