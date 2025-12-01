import { Response, NextFunction } from 'express';
import { UseCaseService } from '../services';
import { AuthRequest, ApiResponse } from '../types';

export class UseCaseController {
  private useCaseService: UseCaseService;

  constructor() {
    this.useCaseService = new UseCaseService();
  }

  getAllUseCases = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const useCases = await this.useCaseService.getAllUseCases();
      res.status(200).json({
        success: true,
        data: useCases,
        count: useCases.length,
      });
    } catch (error) {
      next(error);
    }
  };

  getUseCaseById = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const useCase = await this.useCaseService.getUseCaseById(id);
      res.status(200).json({
        success: true,
        data: useCase,
      });
    } catch (error) {
      next(error);
    }
  };

  getUseCasesByDepartment = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { department } = req.params;
      const useCases = await this.useCaseService.getUseCasesByDepartment(department);
      res.status(200).json({
        success: true,
        data: useCases,
        count: useCases.length,
      });
    } catch (error) {
      next(error);
    }
  };

  getUseCasesByStatus = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { status } = req.params;
      const useCases = await this.useCaseService.getUseCasesByStatus(status);
      res.status(200).json({
        success: true,
        data: useCases,
        count: useCases.length,
      });
    } catch (error) {
      next(error);
    }
  };

  searchUseCases = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { q } = req.query;
      const useCases = await this.useCaseService.searchUseCases(q as string);
      res.status(200).json({
        success: true,
        data: useCases,
        count: useCases.length,
      });
    } catch (error) {
      next(error);
    }
  };

  createUseCase = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const useCase = await this.useCaseService.createUseCase(req.body);
      res.status(201).json({
        success: true,
        data: useCase,
        message: 'Use case created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  updateUseCase = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const useCase = await this.useCaseService.updateUseCase(id, req.body);
      res.status(200).json({
        success: true,
        data: useCase,
        message: 'Use case updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUseCase = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this.useCaseService.deleteUseCase(id);
      res.status(200).json({
        success: true,
        message: 'Use case deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getUseCaseCount = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const count = await this.useCaseService.getUseCaseCount();
      res.status(200).json({
        success: true,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  };
}
