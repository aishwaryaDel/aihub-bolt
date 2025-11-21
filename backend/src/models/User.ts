export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserDTO {
  email: string;
  name: string;
  role: string;
}

export interface UpdateUserDTO {
  email?: string;
  name?: string;
  role?: string;
}
