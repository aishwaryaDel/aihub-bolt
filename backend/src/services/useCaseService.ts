import { supabase } from '../config/database';
import { UseCase, CreateUseCaseDTO, UpdateUseCaseDTO } from '../models/UseCase';
import { logTrace, logException } from '../utils/appInsights';

export class UseCaseService {
  async getAllUseCases(): Promise<UseCase[]> {
    try {
      logTrace('UseCaseService: Fetching all use cases');
      const { data, error } = await supabase
        .from('use_cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      logTrace(`UseCaseService: Retrieved ${data?.length || 0} use cases`);
      return (data || []) as UseCase[];
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.getAllUseCases' });
      throw error;
    }
  }

  async getUseCaseById(id: string): Promise<UseCase | null> {
    try {
      logTrace('UseCaseService: Fetching use case by ID');
      const { data, error } = await supabase
        .from('use_cases')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        logTrace('UseCaseService: Use case not found');
        return null;
      }

      logTrace('UseCaseService: Use case retrieved');
      return data as UseCase;
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.getUseCaseById' });
      throw error;
    }
  }

  async createUseCase(useCaseData: CreateUseCaseDTO): Promise<UseCase> {
    try {
      logTrace('UseCaseService: Creating new use case');
      const { data, error } = await supabase
        .from('use_cases')
        .insert([useCaseData])
        .select()
        .single();

      if (error) throw error;
      logTrace('UseCaseService: Use case created successfully');
      return data as UseCase;
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.createUseCase' });
      throw error;
    }
  }

  async updateUseCase(id: string, updates: UpdateUseCaseDTO): Promise<UseCase | null> {
    try {
      logTrace('UseCaseService: Updating use case');
      const { data, error } = await supabase
        .from('use_cases')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        logTrace('UseCaseService: Use case not found for update');
        return null;
      }

      logTrace('UseCaseService: Use case updated successfully');
      return data as UseCase;
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.updateUseCase' });
      throw error;
    }
  }

  async deleteUseCase(id: string): Promise<boolean> {
    try {
      logTrace('UseCaseService: Deleting use case');
      const { error } = await supabase
        .from('use_cases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      logTrace('UseCaseService: Use case deletion successful');
      return true;
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.deleteUseCase' });
      throw error;
    }
  }
}

export const useCaseService = new UseCaseService();
