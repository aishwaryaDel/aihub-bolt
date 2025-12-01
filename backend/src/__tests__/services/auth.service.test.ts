import { AuthService } from '../../services';
import { UserRepository } from '../../repositories';
import { AppError } from '../../constants/errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../repositories');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let service: AuthService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = new UserRepository() as jest.Mocked<UserRepository>;
    service = new AuthService();
    (service as any).userRepository = mockRepository;
    jest.clearAllMocks();
  });

  describe('login', () => {
    const validCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return token and user on successful login', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        role: 'admin',
      };

      mockRepository.findByEmail = jest.fn().mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      const result = await service.login(validCredentials);

      expect(result).toHaveProperty('token', 'mock-token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error if user not found', async () => {
      mockRepository.findByEmail = jest.fn().mockResolvedValue(null);

      await expect(service.login(validCredentials)).rejects.toThrow(AppError);
    });

    it('should throw error if password is invalid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        role: 'admin',
      };

      mockRepository.findByEmail = jest.fn().mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(validCredentials)).rejects.toThrow(AppError);
    });
  });

  describe('register', () => {
    const validData = {
      email: 'new@example.com',
      password: 'password123',
      name: 'New User',
      role: 'viewer' as const,
    };

    it('should register a new user', async () => {
      const mockCreatedUser = {
        id: '1',
        ...validData,
        password_hash: 'hashed',
      };

      mockRepository.findByEmail = jest.fn().mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepository.create = jest.fn().mockResolvedValue(mockCreatedUser);

      const result = await service.register(validData);

      expect(result).toEqual(mockCreatedUser);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      mockRepository.findByEmail = jest.fn().mockResolvedValue({ id: '1' });

      await expect(service.register(validData)).rejects.toThrow(AppError);
    });

    it('should throw error if password is too short', async () => {
      const invalidData = { ...validData, password: '123' };

      mockRepository.findByEmail = jest.fn().mockResolvedValue(null);

      await expect(service.register(invalidData)).rejects.toThrow(AppError);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const mockDecoded = {
        id: '1',
        email: 'test@example.com',
        role: 'admin' as const,
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const result = await service.verifyToken('valid-token');

      expect(result).toEqual(mockDecoded);
    });

    it('should throw error for invalid token', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(AppError);
    });
  });
});
