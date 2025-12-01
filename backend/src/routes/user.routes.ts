import { Router } from 'express';
import { UserController } from '../controllers';
import { authenticate, authorize } from '../middlewares';

const router = Router();
const userController = new UserController();

router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.get('/me', authenticate, userController.getCurrentUser);
router.get('/count', authenticate, authorize('admin'), userController.getUserCount);
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);
router.put('/:id', authenticate, authorize('admin'), userController.updateUser);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

export default router;
