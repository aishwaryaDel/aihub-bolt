import { UserRepository } from '../repositories';
import { AppError, ErrorMessages, ErrorCodes } from '../constants/errors';
import { User } from '../models';
import { UserRole } from '../constants';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw new AppError(
        ErrorMessages.SERVER.DATABASE_ERROR,
        ErrorCodes.DATABASE_ERROR
      );
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError(ErrorMessages.AUTH.USER_NOT_FOUND, ErrorCodes.NOT_FOUND);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(ErrorMessages.AUTH.USER_NOT_FOUND, ErrorCodes.NOT_FOUND);
    }

    return user;
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      return await this.userRepository.findByRole(role);
    } catch (error) {
      throw new AppError(
        ErrorMessages.SERVER.DATABASE_ERROR,
        ErrorCodes.DATABASE_ERROR
      );
    }
  }

  async updateUser(
    id: string,
    data: Partial<Pick<User, 'name' | 'email' | 'role'>>
  ): Promise<User> {
    await this.getUserById(id);

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new AppError(
          ErrorMessages.VALIDATION.INVALID_FORMAT('email'),
          ErrorCodes.BAD_REQUEST
        );
      }

      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new AppError(
          ErrorMessages.AUTH.USER_ALREADY_EXISTS,
          ErrorCodes.CONFLICT
        );
      }
    }

    try {
      const updatedUser = await this.userRepository.update(id, data);
      if (!updatedUser) {
        throw new AppError(
          ErrorMessages.AUTH.USER_NOT_FOUND,
          ErrorCodes.NOT_FOUND
        );
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ErrorMessages.SERVER.DATABASE_ERROR,
        ErrorCodes.DATABASE_ERROR
      );
    }
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUserById(id);

    try {
      const deleted = await this.userRepository.delete(id);
      if (!deleted) {
        throw new AppError(
          ErrorMessages.AUTH.USER_NOT_FOUND,
          ErrorCodes.NOT_FOUND
        );
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ErrorMessages.SERVER.DATABASE_ERROR,
        ErrorCodes.DATABASE_ERROR
      );
    }
  }

  async getUserCount(): Promise<number> {
    return await this.userRepository.count();
  }
}
