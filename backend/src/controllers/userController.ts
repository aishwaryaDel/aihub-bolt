import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { CreateUserDTO, UpdateUserDTO } from '../models/User';

export class UserController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user',
      });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDTO = req.body;

      const validationError = this.validateUserData(userData);
      if (validationError) {
        res.status(400).json({
          success: false,
          error: validationError,
        });
        return;
      }

      const newUser = await userService.createUser(userData);

      res.status(201).json({
        success: true,
        data: newUser,
        message: 'User created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user',
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateUserDTO = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      if (Object.keys(updates).length === 0) {
        res.status(400).json({
          success: false,
          error: 'No update data provided',
        });
        return;
      }

      const validationError = this.validateUpdateData(updates);
      if (validationError) {
        res.status(400).json({
          success: false,
          error: validationError,
        });
        return;
      }

      const updatedUser = await userService.updateUser(id, updates);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user',
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      await userService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete user',
      });
    }
  }

  private validateUserData(data: CreateUserDTO): string | null {
    if (!data.email || !this.isValidEmail(data.email)) {
      return 'Valid email is required';
    }

    if (!data.name || data.name.trim().length === 0) {
      return 'Name is required';
    }

    if (!data.role || data.role.trim().length === 0) {
      return 'Role is required';
    }

    return null;
  }

  private validateUpdateData(data: UpdateUserDTO): string | null {
    if (data.email && !this.isValidEmail(data.email)) {
      return 'Invalid email format';
    }

    if (data.name !== undefined && data.name.trim().length === 0) {
      return 'Name cannot be empty';
    }

    if (data.role !== undefined && data.role.trim().length === 0) {
      return 'Role cannot be empty';
    }

    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const userController = new UserController();
