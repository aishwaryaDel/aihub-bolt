export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const ErrorMessages = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_MISSING: 'Authentication token is missing',
    TOKEN_INVALID: 'Invalid or expired token',
    FORBIDDEN: 'You do not have permission to perform this action',
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'User with this email already exists',
  },
  USE_CASE: {
    NOT_FOUND: 'Use case not found',
    CREATE_FAILED: 'Failed to create use case',
    UPDATE_FAILED: 'Failed to update use case',
    DELETE_FAILED: 'Failed to delete use case',
    INVALID_DATA: 'Invalid use case data provided',
  },
  VALIDATION: {
    REQUIRED_FIELD: (field: string) => `${field} is required`,
    INVALID_FORMAT: (field: string) => `${field} has invalid format`,
    INVALID_LENGTH: (field: string, min: number, max: number) =>
      `${field} must be between ${min} and ${max} characters`,
    INVALID_ENUM: (field: string, values: string[]) =>
      `${field} must be one of: ${values.join(', ')}`,
  },
  SERVER: {
    INTERNAL_ERROR: 'Internal server error',
    DATABASE_ERROR: 'Database operation failed',
    NOT_FOUND: 'Resource not found',
    BAD_REQUEST: 'Bad request',
  },
};

export const ErrorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER: 500,
  DATABASE_ERROR: 500,
};
