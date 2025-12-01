import { Router } from 'express';
import useCaseRoutes from './useCase.routes';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/use-cases', useCaseRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
