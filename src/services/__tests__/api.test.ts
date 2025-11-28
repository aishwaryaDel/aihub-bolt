import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCaseApi, authApi } from '../api';

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('authApi', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          token: 'mock-token',
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'admin',
          },
        },
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await authApi.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle login failure', async () => {
      const mockError = {
        success: false,
        error: 'Invalid credentials',
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response);

      await expect(
        authApi.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('useCaseApi', () => {
    it('should fetch all use cases', async () => {
      const mockUseCases = [
        {
          id: '1',
          title: 'Use Case 1',
          short_description: 'Description 1',
          department: 'IT',
          status: 'Live',
        },
        {
          id: '2',
          title: 'Use Case 2',
          short_description: 'Description 2',
          department: 'Marketing',
          status: 'PoC',
        },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockUseCases }),
      } as Response);

      const result = await useCaseApi.getAllUseCases();

      expect(result).toEqual(mockUseCases);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle fetch error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false, error: 'Failed to fetch' }),
      } as Response);

      await expect(useCaseApi.getAllUseCases()).rejects.toThrow(
        'Failed to fetch'
      );
    });

    it('should fetch a specific use case', async () => {
      const mockUseCase = {
        id: '1',
        title: 'Use Case 1',
        short_description: 'Description 1',
        department: 'IT',
        status: 'Live',
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockUseCase }),
      } as Response);

      const result = await useCaseApi.getUseCaseById('1');

      expect(result).toEqual(mockUseCase);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should create a new use case', async () => {
      const newUseCase = {
        title: 'New Use Case',
        short_description: 'New Description',
        full_description: 'Full Description',
        department: 'IT',
        status: 'Ideation',
        owner_name: 'John Doe',
        owner_email: 'john@example.com',
        business_impact: 'High',
        technology_stack: ['React'],
        internal_links: {},
        tags: ['test'],
        related_use_case_ids: [],
        application_url: null,
      };

      const mockResponse = {
        id: '3',
        ...newUseCase,
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockResponse }),
      } as Response);

      const result = await useCaseApi.createUseCase(newUseCase as any);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should update an existing use case', async () => {
      const updates = {
        title: 'Updated Title',
        status: 'MVP',
      };

      const mockResponse = {
        id: '1',
        title: 'Updated Title',
        status: 'MVP',
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockResponse }),
      } as Response);

      const result = await useCaseApi.updateUseCase('1', updates as any);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should delete a use case', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      await useCaseApi.deleteUseCase('1');

      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
