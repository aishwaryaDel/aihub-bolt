import { User } from '../models';
import { CreateUserDTO } from '../types';
import { UserRole } from '../constants';

export class UserRepository {
  async findAll(): Promise<User[]> {
    return User.findAll({
      order: [['created_at', 'DESC']],
    });
  }

  async findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({
      where: { email },
    });
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return User.findAll({
      where: { role },
      order: [['created_at', 'DESC']],
    });
  }

  async create(data: CreateUserDTO & { password_hash: string }): Promise<User> {
    return User.create(data as any);
  }

  async update(
    id: string,
    data: Partial<Pick<User, 'name' | 'email' | 'role'>>
  ): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    await user.update(data as any);
    return user;
  }

  async updatePassword(id: string, password_hash: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;

    await user.update({ password_hash });
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;

    await user.destroy();
    return true;
  }

  async count(): Promise<number> {
    return User.count();
  }

  async exists(email: string): Promise<boolean> {
    const count = await User.count({ where: { email } });
    return count > 0;
  }
}
