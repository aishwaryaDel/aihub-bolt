import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database';
import { logTrace, logException } from '../utils/appInsights';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    try {
      logTrace('AuthService: Starting login');
      const { email, password } = credentials;

      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, password, name, role')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;

      if (!user) {
        logTrace('AuthService: User not found');
        return null;
      }

      const isPasswordValid = password === user.password || await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        logTrace('AuthService: Invalid password');
        return null;
      }

      logTrace('AuthService: Generating JWT token');
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      logTrace('AuthService: Login successful');
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (error) {
      logException(error as Error, { context: 'authService.login' });
      throw error;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  verifyToken(token: string): any {
    try {
      logTrace('AuthService: Verifying token');
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logTrace('AuthService: Token verification failed');
      logException(error as Error, { context: 'authService.verifyToken' });
      return null;
    }
  }
}

export const authService = new AuthService();
