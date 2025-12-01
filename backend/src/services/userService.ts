import { query } from '../config/database';
import { User, CreateUserDTO, UpdateUserDTO } from '../models/User';
import { authService } from './authService';
import { logTrace, logException } from '../utils/appInsights';

export class UserService {
  async getAllUsers(): Promise<User[]> {
    try {
      logTrace('UserService: Fetching all users');
      const result = await query('SELECT id, email, name, role, created_at, updated_at FROM users ORDER BY created_at DESC');
      logTrace(`UserService: Retrieved ${result.rows.length} users`);
      return result.rows as User[];
    } catch (error) {
      logException(error as Error, { context: 'userService.getAllUsers' });
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      logTrace('UserService: Fetching user by ID');
      const result = await query('SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        logTrace('UserService: User not found');
        return null;
      }

      logTrace('UserService: User retrieved');
      return result.rows[0] as User;
    } catch (error) {
      logException(error as Error, { context: 'userService.getUserById' });
      throw error;
    }
  }

  async createUser(userData: CreateUserDTO): Promise<User> {
    try {
      logTrace('UserService: Creating new user');
      const { email, password, name, role } = userData;

      const hashedPassword = await authService.hashPassword(password);

      const result = await query(
        `INSERT INTO users (
          email, password, name, role, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id, email, name, role, created_at, updated_at`,
        [email, hashedPassword, name, role]
      );

      logTrace('UserService: User created successfully');
      return result.rows[0] as User;
    } catch (error) {
      logException(error as Error, { context: 'userService.createUser' });
      throw error;
    }
  }

  async updateUser(id: string, updates: UpdateUserDTO): Promise<User | null> {
    try {
      logTrace('UserService: Updating user');
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
      logTrace('UserService: User not found for update');
      return null;
    }

    logTrace('UserService: User updated successfully');
    return result.rows[0] as User;
    } catch (error) {
      logException(error as Error, { context: 'userService.updateUser' });
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      logTrace('UserService: Deleting user');
      const result = await query('DELETE FROM users WHERE id = $1', [id]);
      const success = result.rowCount !== null && result.rowCount > 0;
      logTrace(`UserService: User deletion ${success ? 'successful' : 'failed'}`);
      return success;
    } catch (error) {
      logException(error as Error, { context: 'userService.deleteUser' });
      throw error;
    }
  }
}

export const userService = new UserService();
