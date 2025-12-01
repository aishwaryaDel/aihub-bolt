# Backend Architecture Documentation

## Overview

This backend follows a clean, layered architecture with clear separation of concerns. The architecture is designed to be modular, scalable, testable, and maintainable.

## Architecture Layers

```
Controllers → Services → Repositories → Models
```

### 1. Controllers (`src/controllers/`)

**Responsibility**: Handle HTTP communication only

- Parse HTTP requests
- Validate request parameters
- Call appropriate service methods
- Format HTTP responses
- Handle HTTP status codes
- **No business logic**

**Example**:
```typescript
createUseCase = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const useCase = await this.useCaseService.createUseCase(req.body);
    res.status(201).json({ success: true, data: useCase });
  } catch (error) {
    next(error);
  }
};
```

### 2. Services (`src/services/`)

**Responsibility**: Business logic layer

- Implement business rules and validation
- Coordinate between repositories
- Handle data transformation
- Throw domain-specific errors
- **No database queries** (delegated to repositories)

**Example**:
```typescript
async createUseCase(data: CreateUseCaseDTO): Promise<UseCase> {
  this.validateUseCaseData(data);
  return await this.useCaseRepository.create(data);
}
```

### 3. Repositories (`src/repositories/`)

**Responsibility**: Data access layer

- Handle all database queries
- Contain all `WHERE` conditions
- Manage database operations (CRUD)
- Return model instances or null
- **No business logic**

**Example**:
```typescript
async findByDepartment(department: string): Promise<UseCase[]> {
  return UseCase.findAll({
    where: { department },
    order: [['created_at', 'DESC']],
  });
}
```

### 4. Models (`src/models/`)

**Responsibility**: Database schema definition

- Define table structure using Sequelize-TypeScript decorators
- Specify column types and constraints
- Handle timestamps
- **No business logic or queries**

**Example**:
```typescript
@Table({ tableName: 'use_cases', timestamps: true })
export class UseCase extends Model<UseCaseAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;
}
```

## Supporting Components

### Middlewares (`src/middlewares/`)

Reusable request processing logic:

- **Authentication** (`auth.middleware.ts`): JWT token verification
- **Authorization** (`auth.middleware.ts`): Role-based access control
- **Error Handling** (`error.middleware.ts`): Global error handler
- **Validation** (`validation.middleware.ts`): DTO validation with class-validator
- **CORS** (`cors.middleware.ts`): Cross-origin resource sharing
- **Logging** (via morgan): HTTP request logging

### Configuration (`src/config/`)

Environment-based configuration:

- **env.config.ts**: Environment variables
- **database.config.ts**: Sequelize database connection
- **logger.config.ts**: Logging configuration

### Constants (`src/constants/`)

Centralized constants and enums:

- **errors.ts**: Error classes, error messages, error codes
- **index.ts**: Application constants (departments, statuses, roles)

### Types (`src/types/`)

TypeScript type definitions:

- Request/Response interfaces
- DTOs (Data Transfer Objects)
- Domain model attributes
- API response types

### Routes (`src/routes/`)

Modular route definitions:

- **useCase.routes.ts**: Use case endpoints
- **auth.routes.ts**: Authentication endpoints
- **user.routes.ts**: User management endpoints
- **index.ts**: Route aggregation

## Testing Structure

### Unit Tests (`src/__tests__/`)

Comprehensive test coverage with mocks:

```
__tests__/
├── controllers/        # Controller tests with mocked services
├── services/          # Service tests with mocked repositories
├── repositories/      # Repository tests with mocked models
└── middlewares/       # Middleware tests
```

**Testing Principles**:
- Each layer is tested in isolation
- Dependencies are mocked
- Business logic is thoroughly covered
- Edge cases and error scenarios are tested

## Design Principles

### 1. Single Responsibility Principle
Each class/module has one reason to change:
- Controllers handle HTTP only
- Services handle business logic only
- Repositories handle data access only

### 2. Dependency Injection
Services and repositories are injected into dependent classes, making testing easier.

### 3. Error Handling
- Custom `AppError` class for operational errors
- Global error handler middleware
- Consistent error responses
- Different error codes for different scenarios

### 4. Type Safety
- TypeScript throughout the codebase
- Strict type checking enabled
- DTOs for data validation
- Type definitions for all interfaces

### 5. Configuration Management
- Environment-based configuration
- No hardcoded values
- Secure credential handling
- Easy environment switching

## API Structure

### Endpoint Pattern
```
/api/{resource}/{action}
```

### Response Format
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  count?: number;
}
```

## Database Strategy

- **ORM**: Sequelize-TypeScript
- **Decorators**: For model definitions
- **Migrations**: SQL-based migrations in `migrations/`
- **Connection Pooling**: Configured in database config
- **Timestamps**: Automatic `created_at` and `updated_at`

## Security Features

1. **JWT Authentication**: Token-based authentication
2. **Role-Based Access Control**: Admin/Viewer roles
3. **Helmet**: Security headers
4. **CORS**: Controlled cross-origin access
5. **Input Validation**: class-validator for DTOs
6. **Password Hashing**: bcrypt for password security

## Development Workflow

### Adding a New Feature

1. **Model**: Define database schema in `models/`
2. **Repository**: Add data access methods in `repositories/`
3. **Service**: Implement business logic in `services/`
4. **Controller**: Add HTTP handlers in `controllers/`
5. **Routes**: Define endpoints in `routes/`
6. **Tests**: Write unit tests for each layer
7. **Types**: Add TypeScript types in `types/`

### Running the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Tests
npm test
npm run test:coverage
```

## Environment Variables

Required environment variables:

```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tesa_ai_hub
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
```

## Best Practices

1. **Never** put business logic in controllers
2. **Never** put database queries in services
3. **Always** use repositories for data access
4. **Always** validate input data
5. **Always** handle errors properly
6. **Always** write tests for new features
7. **Never** hardcode configuration values
8. **Always** use TypeScript types
9. **Always** follow naming conventions
10. **Always** document complex logic

## Folder Structure

```
src/
├── config/              # Configuration files
├── constants/           # Application constants
├── controllers/         # HTTP request handlers
├── middlewares/         # Express middlewares
├── models/             # Database models (Sequelize)
├── repositories/       # Data access layer
├── routes/             # Route definitions
├── services/           # Business logic layer
├── types/              # TypeScript type definitions
├── __tests__/          # Unit tests
├── app.ts              # Express app setup
└── server.ts           # Server entry point
```

## Code Quality

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint configuration
- **Testing**: Jest with >80% coverage target
- **Documentation**: JSDoc comments for public APIs
- **Error Handling**: Comprehensive error handling
- **Logging**: Structured logging with morgan

---

This architecture ensures maintainability, testability, and scalability as the application grows.
