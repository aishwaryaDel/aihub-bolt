import { query } from '../config/database';
import { User, CreateUserDTO, UpdateUserDTO } from '../models/User';
import { authService } from './authService';

export class UserService {
  async getAllUsers(): Promise<User[]> {
    const result = await query('SELECT id, email, name, role, created_at, updated_at FROM users ORDER BY created_at DESC');
    return result.rows as User[];
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await query('SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0] as User;
  }

  async createUser(userData: CreateUserDTO): Promise<User> {
    const { email, password, name, role } = userData;

    const hashedPassword = await authService.hashPassword(password);

    const result = await query(
      `INSERT INTO users (
        email, password, name, role, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, email, name, role, created_at, updated_at`,
      [email, hashedPassword, name, role]
    );

    return result.rows[0] as User;
  }

  async updateUser(id: string, updates: UpdateUserDTO): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(updates.email);
    }
    if (updates.password !== undefined) {
      const hashedPassword = await authService.hashPassword(updates.password);
      fields.push(`password = $${paramIndex++}`);
      values.push(hashedPassword);
    }
    if (updates.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.role !== undefined) {
      fields.push(`role = $${paramIndex++}`);
      values.push(updates.role);
    }

    if (fields.length === 0) {
      const result = await query('SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1', [id]);
      return result.rows[0] as User || null;
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, name, role, created_at, updated_at`,
      values
    );

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0] as User;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const userService = new UserService();
