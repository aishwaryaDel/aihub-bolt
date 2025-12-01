import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { AppError } from '../../constants/errors';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate valid token', () => {
      const mockDecoded = {
        id: '1',
        email: 'test@example.com',
        role: 'admin',
      };

      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      authenticate(mockRequest as any, mockResponse as Response, nextFunction);

      expect((mockRequest as any).user).toEqual(mockDecoded);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should reject missing token', () => {
      authenticate(mockRequest as any, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should reject invalid token format', () => {
      mockRequest.headers = {
        authorization: 'InvalidFormat token',
      };

      authenticate(mockRequest as any, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should reject expired token', () => {
      mockRequest.headers = {
        authorization: 'Bearer expired-token',
      };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Token expired');
      });

      authenticate(mockRequest as any, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe('authorize', () => {
    it('should allow user with correct role', () => {
      mockRequest = {
        user: {
          id: '1',
          email: 'admin@example.com',
          role: 'admin',
        },
      };

      const middleware = authorize('admin');
      middleware(mockRequest as any, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should reject user without required role', () => {
      mockRequest = {
        user: {
          id: '1',
          email: 'viewer@example.com',
          role: 'viewer',
        },
      };

      const middleware = authorize('admin');
      middleware(mockRequest as any, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should reject request without user', () => {
      const middleware = authorize('admin');

      expect(() => {
        middleware(mockRequest as any, mockResponse as Response, nextFunction);
      }).toThrow(AppError);
    });
  });
});
