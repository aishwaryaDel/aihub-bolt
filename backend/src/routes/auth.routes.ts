import { Router } from 'express';
import { AuthController } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/change-password', authenticate, authController.changePassword);
router.get('/verify', authenticate, authController.verifyToken);

export default router;
