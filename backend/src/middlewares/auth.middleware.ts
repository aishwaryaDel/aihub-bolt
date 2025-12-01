import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env.config';
import { AppError, ErrorMessages, ErrorCodes } from '../constants/errors';
import { AuthRequest, AuthenticatedUser } from '../types';
import { UserRole } from '../constants';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(ErrorMessages.AUTH.TOKEN_MISSING, ErrorCodes.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, env.jwt.secret) as AuthenticatedUser;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(ErrorMessages.AUTH.TOKEN_INVALID, ErrorCodes.UNAUTHORIZED));
    } else {
      next(error);
    }
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(ErrorMessages.AUTH.UNAUTHORIZED, ErrorCodes.UNAUTHORIZED);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(ErrorMessages.AUTH.FORBIDDEN, ErrorCodes.FORBIDDEN);
    }

    next();
  };
};
