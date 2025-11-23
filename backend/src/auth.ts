import express from 'express';
import { loginUser } from './controllers/authController';

const router = express.Router();

// Login-Endpoint
router.post('/login', loginUser);

export default router;
