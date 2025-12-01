import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppError, ErrorCodes } from '../constants/errors';

export const validateDTO = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dtoInstance = plainToInstance(dtoClass, req.body);
      const errors: ValidationError[] = await validate(dtoInstance);

      if (errors.length > 0) {
        const messages = errors
          .map((error) => Object.values(error.constraints || {}))
          .flat();

        throw new AppError(
          messages.join(', '),
          ErrorCodes.UNPROCESSABLE_ENTITY
        );
      }

      req.body = dtoInstance;
      next();
    } catch (error) {
      next(error);
    }
  };
};
