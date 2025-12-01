import { Request, Response, NextFunction } from 'express';
import { UseCaseController } from '../../controllers';
import { UseCaseService } from '../../services';

jest.mock('../../services');

describe('UseCaseController', () => {
  let controller: UseCaseController;
  let mockService: jest.Mocked<UseCaseService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockService = new UseCaseService() as jest.Mocked<UseCaseService>;
    controller = new UseCaseController();
    (controller as any).useCaseService = mockService;

    mockRequest = {
      params: {},
      body: {},
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAllUseCases', () => {
    it('should return all use cases', async () => {
      const mockUseCases = [
        { id: '1', title: 'Test 1' },
        { id: '2', title: 'Test 2' },
      ];

      mockService.getAllUseCases = jest.fn().mockResolvedValue(mockUseCases);

      await controller.getAllUseCases(
        mockRequest as any,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockUseCases,
        count: 2,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      mockService.getAllUseCases = jest.fn().mockRejectedValue(error);

      await controller.getAllUseCases(
        mockRequest as any,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(error);
    });
  });

  describe('getUseCaseById', () => {
    it('should return a use case by id', async () => {
      const mockUseCase = { id: '1', title: 'Test' };
      mockRequest.params = { id: '1' };

      mockService.getUseCaseById = jest.fn().mockResolvedValue(mockUseCase);

      await controller.getUseCaseById(
        mockRequest as any,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockUseCase,
      });
    });
  });

  describe('createUseCase', () => {
    it('should create a new use case', async () => {
      const mockData = {
        title: 'New Use Case',
        short_description: 'Description',
        full_description: 'Full description',
        benefits: 'Benefits',
        department: 'IT',
        status: 'Live',
      };

      const mockCreated = { id: '1', ...mockData };
      mockRequest.body = mockData;

      mockService.createUseCase = jest.fn().mockResolvedValue(mockCreated);

      await controller.createUseCase(
        mockRequest as any,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreated,
        message: 'Use case created successfully',
      });
    });
  });

  describe('deleteUseCase', () => {
    it('should delete a use case', async () => {
      mockRequest.params = { id: '1' };

      mockService.deleteUseCase = jest.fn().mockResolvedValue(undefined);

      await controller.deleteUseCase(
        mockRequest as any,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Use case deleted successfully',
      });
    });
  });
});
