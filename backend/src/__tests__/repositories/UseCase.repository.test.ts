import { UseCaseRepository } from '../../repositories';
import { UseCase } from '../../models';

jest.mock('../../models');

describe('UseCaseRepository', () => {
  let repository: UseCaseRepository;

  beforeEach(() => {
    repository = new UseCaseRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all use cases', async () => {
      const mockUseCases = [
        { id: '1', title: 'Test Use Case 1' },
        { id: '2', title: 'Test Use Case 2' },
      ];

      (UseCase.findAll as jest.Mock).mockResolvedValue(mockUseCases);

      const result = await repository.findAll();

      expect(result).toEqual(mockUseCases);
      expect(UseCase.findAll).toHaveBeenCalledWith({
        order: [['created_at', 'DESC']],
      });
    });
  });

  describe('findById', () => {
    it('should return a use case by id', async () => {
      const mockUseCase = { id: '1', title: 'Test Use Case' };

      (UseCase.findByPk as jest.Mock).mockResolvedValue(mockUseCase);

      const result = await repository.findById('1');

      expect(result).toEqual(mockUseCase);
      expect(UseCase.findByPk).toHaveBeenCalledWith('1');
    });

    it('should return null if use case not found', async () => {
      (UseCase.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new use case', async () => {
      const mockData = {
        title: 'New Use Case',
        short_description: 'Description',
        full_description: 'Full description',
        benefits: 'Benefits',
        department: 'IT',
        status: 'Live',
      };

      const mockCreatedUseCase = { id: '1', ...mockData };

      (UseCase.create as jest.Mock).mockResolvedValue(mockCreatedUseCase);

      const result = await repository.create(mockData);

      expect(result).toEqual(mockCreatedUseCase);
      expect(UseCase.create).toHaveBeenCalledWith(mockData);
    });
  });

  describe('delete', () => {
    it('should delete a use case', async () => {
      const mockUseCase = {
        id: '1',
        destroy: jest.fn().mockResolvedValue(undefined),
      };

      (UseCase.findByPk as jest.Mock).mockResolvedValue(mockUseCase);

      const result = await repository.delete('1');

      expect(result).toBe(true);
      expect(mockUseCase.destroy).toHaveBeenCalled();
    });

    it('should return false if use case not found', async () => {
      (UseCase.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await repository.delete('999');

      expect(result).toBe(false);
    });
  });
});
