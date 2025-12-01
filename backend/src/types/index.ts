import { Request } from 'express';
import { UserRole } from '../constants';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface UseCaseAttributes {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  benefits: string;
  department: string;
  status: string;
  application_url?: string;
  sharepoint_url?: string;
  confluence_url?: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUseCaseDTO {
  title: string;
  short_description: string;
  full_description: string;
  benefits: string;
  department: string;
  status: string;
  application_url?: string;
  sharepoint_url?: string;
  confluence_url?: string;
  image_url?: string;
}

export interface UpdateUseCaseDTO {
  title?: string;
  short_description?: string;
  full_description?: string;
  benefits?: string;
  department?: string;
  status?: string;
  application_url?: string;
  sharepoint_url?: string;
  confluence_url?: string;
  image_url?: string;
}

export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDTO {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}
