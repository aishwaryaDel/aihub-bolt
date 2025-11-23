import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { LoginCredentials } from '../services/authService';

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password }: LoginCredentials = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const result = await authService.login({ email, password });

    if (!result) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    });
  }
}
