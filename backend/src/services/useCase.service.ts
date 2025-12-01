import { UseCaseRepository } from '../repositories';
import { CreateUseCaseDTO, UpdateUseCaseDTO } from '../types';
import { AppError, ErrorMessages, ErrorCodes } from '../constants/errors';
import { UseCase } from '../models';
import { DEPARTMENTS, STATUSES } from '../constants';

export class UseCaseService {
  private useCaseRepository: UseCaseRepository;

  constructor() {
    this.useCaseRepository = new UseCaseRepository();
  }

  async getAllUseCases(): Promise<UseCase[]> {
    try {
      return await this.useCaseRepository.findAll();
    } catch (error) {
      throw new AppError(
        ErrorMessages.SERVER.DATABASE_ERROR,
        ErrorCodes.DATABASE_ERROR
      );
    }
  }

  async getUseCaseById(id: string): Promise<UseCase> {
    const useCase = await this.useCaseRepository.findById(id);

    if (!useCase) {
      throw new AppError(ErrorMessages.USE_CASE.NOT_FOUND, ErrorCodes.NOT_FOUND);
    }

    return useCase;
  }

  async getUseCasesByDepartment(department: string): Promise<UseCase[]> {
    if (!DEPARTMENTS.includes(department as any)) {
      throw new AppError(
        ErrorMessages.VALIDATION.INVALID_ENUM('department', DEPARTMENTS as any),
        ErrorCodes.BAD_REQUEST
      );
    }

    return await this.useCaseRepository.findByDepartment(department);
  }

  async getUseCasesByStatus(status: string): Promise<UseCase[]> {
    if (!STATUSES.includes(status as any)) {
      throw new AppError(
        ErrorMessages.VALIDATION.INVALID_ENUM('status', STATUSES as any),
        ErrorCodes.BAD_REQUEST
      );
    }

    return await this.useCaseRepository.findByStatus(status);
  }

  async searchUseCases(query: string): Promise<UseCase[]> {
    if (!query || query.trim().length === 0) {
      throw new AppError(
        ErrorMessages.VALIDATION.REQUIRED_FIELD('search query'),
        ErrorCodes.BAD_REQUEST
      );
    }

    return await this.useCaseRepository.search(query.trim());
  }

  async createUseCase(data: CreateUseCaseDTO): Promise<UseCase> {
    this.validateUseCaseData(data);

    try {
      return await this.useCaseRepository.create(data);
    } catch (error) {
      throw new AppError(
        ErrorMessages.USE_CASE.CREATE_FAILED,
        ErrorCodes.DATABASE_ERROR
      );
    }
  }

  async updateUseCase(id: string, data: UpdateUseCaseDTO): Promise<UseCase> {
    await this.getUseCaseById(id);

    if (data.department && !DEPARTMENTS.includes(data.department as any)) {
      throw new AppError(
        ErrorMessages.VALIDATION.INVALID_ENUM('department', DEPARTMENTS as any),
        ErrorCodes.BAD_REQUEST
      );
    }

    if (data.status && !STATUSES.includes(data.status as any)) {
      throw new AppError(
        ErrorMessages.VALIDATION.INVALID_ENUM('status', STATUSES as any),
        ErrorCodes.BAD_REQUEST
      );
    }

    try {
      const updatedUseCase = await this.useCaseRepository.update(id, data);
      if (!updatedUseCase) {
        throw new AppError(ErrorMessages.USE_CASE.UPDATE_FAILED, ErrorCodes.NOT_FOUND);
      }
      return updatedUseCase;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ErrorMessages.USE_CASE.UPDATE_FAILED,
        ErrorCodes.DATABASE_ERROR
      );
    }
  }

  async deleteUseCase(id: string): Promise<void> {
    await this.getUseCaseById(id);

    try {
      const deleted = await this.useCaseRepository.delete(id);
      if (!deleted) {
        throw new AppError(ErrorMessages.USE_CASE.DELETE_FAILED, ErrorCodes.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ErrorMessages.USE_CASE.DELETE_FAILED,
        ErrorCodes.DATABASE_ERROR
      );
    }
  }

  async getUseCaseCount(): Promise<number> {
    return await this.useCaseRepository.count();
  }

  private validateUseCaseData(data: CreateUseCaseDTO): void {
    if (!data.title || data.title.trim().length === 0) {
      throw new AppError(
        ErrorMessages.VALIDATION.REQUIRED_FIELD('title'),
        ErrorCodes.BAD_REQUEST
      );
    }

    if (data.title.length > 200) {
      throw new AppError(
        ErrorMessages.VALIDATION.INVALID_LENGTH('title', 1, 200),
        ErrorCodes.BAD_REQUEST
      );
    }

    if (!data.short_description || data.short_description.trim().length === 0) {
      throw new AppError(
        ErrorMessages.VALIDATION.REQUIRED_FIELD('short_description'),
        ErrorCodes.BAD_REQUEST
      );
    }

    if (data.short_description.length > 300) {
      throw new AppError(
        ErrorMessages.VALIDATION.INVALID_LENGTH('short_description', 1, 300),
        ErrorCodes.BAD_REQUEST
      );
    }

    if (!data.full_description || data.full_description.trim().length === 0) {
      throw new AppError(
        ErrorMessages.VALIDATION.REQUIRED_FIELD('full_description'),
        ErrorCodes.BAD_REQUEST
      );
    }

    if (!data.benefits || data.benefits.trim().length === 0) {
      throw new AppError(
        ErrorMessages.VALIDATION.REQUIRED_FIELD('benefits'),
        ErrorCodes.BAD_REQUEST
      );
    }

    if (!DEPARTMENTS.includes(data.department as any)) {
      throw new AppError(
        ErrorMessages.VALIDATION.INVALID_ENUM('department', DEPARTMENTS as any),
        ErrorCodes.BAD_REQUEST
      );
    }

    if (!STATUSES.includes(data.status as any)) {
      throw new AppError(
        ErrorMessages.VALIDATION.INVALID_ENUM('status', STATUSES as any),
        ErrorCodes.BAD_REQUEST
      );
    }
  }
}
