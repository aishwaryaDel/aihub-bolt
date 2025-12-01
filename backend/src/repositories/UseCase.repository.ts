import { UseCase } from '../models';
import { CreateUseCaseDTO, UpdateUseCaseDTO } from '../types';
import { Op } from 'sequelize';

export class UseCaseRepository {
  async findAll(): Promise<UseCase[]> {
    return UseCase.findAll({
      order: [['created_at', 'DESC']],
    });
  }

  async findById(id: string): Promise<UseCase | null> {
    return UseCase.findByPk(id);
  }

  async findByDepartment(department: string): Promise<UseCase[]> {
    return UseCase.findAll({
      where: { department },
      order: [['created_at', 'DESC']],
    });
  }

  async findByStatus(status: string): Promise<UseCase[]> {
    return UseCase.findAll({
      where: { status },
      order: [['created_at', 'DESC']],
    });
  }

  async search(query: string): Promise<UseCase[]> {
    return UseCase.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { short_description: { [Op.iLike]: `%${query}%` } },
          { full_description: { [Op.iLike]: `%${query}%` } },
        ],
      },
      order: [['created_at', 'DESC']],
    });
  }

  async create(data: CreateUseCaseDTO): Promise<UseCase> {
    return UseCase.create(data as any);
  }

  async update(id: string, data: UpdateUseCaseDTO): Promise<UseCase | null> {
    const useCase = await this.findById(id);
    if (!useCase) return null;

    await useCase.update(data);
    return useCase;
  }

  async delete(id: string): Promise<boolean> {
    const useCase = await this.findById(id);
    if (!useCase) return false;

    await useCase.destroy();
    return true;
  }

  async count(): Promise<number> {
    return UseCase.count();
  }

  async countByDepartment(department: string): Promise<number> {
    return UseCase.count({ where: { department } });
  }

  async countByStatus(status: string): Promise<number> {
    return UseCase.count({ where: { status } });
  }
}
