import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories';
import { LoginDTO, CreateUserDTO, AuthenticatedUser } from '../types';
import { AppError, ErrorMessages, ErrorCodes } from '../constants/errors';
import env from '../config/env.config';
import { User } from '../models';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(
    credentials: LoginDTO
  ): Promise<{ token: string; user: AuthenticatedUser }> {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new AppError(
        ErrorMessages.VALIDATION.REQUIRED_FIELD('email and password'),
        ErrorCodes.BAD_REQUEST
      );
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(
        ErrorMessages.AUTH.INVALID_CREDENTIALS,
        ErrorCodes.UNAUTHORIZED
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError(
        ErrorMessages.AUTH.INVALID_CREDENTIALS,
        ErrorCodes.UNAUTHORIZED
      );
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      role: user.role as any,
    };

    const token = jwt.sign(
      authenticatedUser,
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn } as jwt.SignOptions
    );

    return {
      token,
      user: authenticatedUser,
    };
  }

  async register(data: CreateUserDTO): Promise<User> {
    const { email, password, name, role } = data;

    if (!email || !password || !name) {
      throw new AppError(
        ErrorMessages.VALIDATION.REQUIRED_FIELD('email, password, and name'),
        ErrorCodes.BAD_REQUEST
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError(
        ErrorMessages.VALIDATION.INVALID_FORMAT('email'),
        ErrorCodes.BAD_REQUEST
      );
    }

    if (password.length < 8) {
      throw new AppError(
        'Password must be at least 8 characters long',
        ErrorCodes.BAD_REQUEST
      );
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError(
        ErrorMessages.AUTH.USER_ALREADY_EXISTS,
        ErrorCodes.CONFLICT
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    try {
      return await this.userRepository.create({
        email,
        name,
        role,
        password_hash,
      } as any);
    } catch (error) {
      throw new AppError(
        ErrorMessages.SERVER.DATABASE_ERROR,
        ErrorCodes.DATABASE_ERROR
      );
    }
  }

  async verifyToken(token: string): Promise<AuthenticatedUser> {
    try {
      const decoded = jwt.verify(token, env.jwt.secret) as AuthenticatedUser;
      return decoded;
    } catch (error) {
      throw new AppError(ErrorMessages.AUTH.TOKEN_INVALID, ErrorCodes.UNAUTHORIZED);
    }
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(ErrorMessages.AUTH.USER_NOT_FOUND, ErrorCodes.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError(
        ErrorMessages.AUTH.INVALID_CREDENTIALS,
        ErrorCodes.UNAUTHORIZED
      );
    }

    if (newPassword.length < 8) {
      throw new AppError(
        'Password must be at least 8 characters long',
        ErrorCodes.BAD_REQUEST
      );
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(userId, password_hash);
  }
}
