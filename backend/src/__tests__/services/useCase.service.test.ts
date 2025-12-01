import { UseCaseService } from '../../services';
import { UseCaseRepository } from '../../repositories';
import { AppError } from '../../constants/errors';

jest.mock('../../repositories');

describe('UseCaseService', () => {
  let service: UseCaseService;
  let mockRepository: jest.Mocked<UseCaseRepository>;

  beforeEach(() => {
    mockRepository = new UseCaseRepository() as jest.Mocked<UseCaseRepository>;
    service = new UseCaseService();
    (service as any).useCaseRepository = mockRepository;
    jest.clearAllMocks();
  });

  describe('getAllUseCases', () => {
    it('should return all use cases', async () => {
      const mockUseCases = [
        { id: '1', title: 'Test 1' },
        { id: '2', title: 'Test 2' },
      ];

      mockRepository.findAll = jest.fn().mockResolvedValue(mockUseCases);

      const result = await service.getAllUseCases();

      expect(result).toEqual(mockUseCases);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('getUseCaseById', () => {
    it('should return a use case by id', async () => {
      const mockUseCase = { id: '1', title: 'Test' };

      mockRepository.findById = jest.fn().mockResolvedValue(mockUseCase);

      const result = await service.getUseCaseById('1');

      expect(result).toEqual(mockUseCase);
    });

    it('should throw error if use case not found', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(service.getUseCaseById('999')).rejects.toThrow(AppError);
    });
  });

  describe('createUseCase', () => {
    const validData = {
      title: 'New Use Case',
      short_description: 'Short desc',
      full_description: 'Full desc',
      benefits: 'Benefits',
      department: 'IT',
      status: 'Live',
    };

    it('should create a new use case with valid data', async () => {
      const mockCreatedUseCase = { id: '1', ...validData };

      mockRepository.create = jest.fn().mockResolvedValue(mockCreatedUseCase);

      const result = await service.createUseCase(validData);

      expect(result).toEqual(mockCreatedUseCase);
      expect(mockRepository.create).toHaveBeenCalledWith(validData);
    });

    it('should throw error if title is missing', async () => {
      const invalidData = { ...validData, title: '' };

      await expect(service.createUseCase(invalidData)).rejects.toThrow(AppError);
    });

    it('should throw error if department is invalid', async () => {
      const invalidData = { ...validData, department: 'InvalidDept' };

      await expect(service.createUseCase(invalidData)).rejects.toThrow(AppError);
    });
  });

  describe('deleteUseCase', () => {
    it('should delete a use case', async () => {
      const mockUseCase = { id: '1', title: 'Test' };

      mockRepository.findById = jest.fn().mockResolvedValue(mockUseCase);
      mockRepository.delete = jest.fn().mockResolvedValue(true);

      await service.deleteUseCase('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw error if use case not found', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(service.deleteUseCase('999')).rejects.toThrow(AppError);
    });
  });
});
