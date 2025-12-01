import { Router } from 'express';
import { UseCaseController } from '../controllers';
import { authenticate, authorize } from '../middlewares';

const router = Router();
const useCaseController = new UseCaseController();

router.get('/', authenticate, useCaseController.getAllUseCases);
router.get('/count', authenticate, useCaseController.getUseCaseCount);
router.get('/search', authenticate, useCaseController.searchUseCases);
router.get('/department/:department', authenticate, useCaseController.getUseCasesByDepartment);
router.get('/status/:status', authenticate, useCaseController.getUseCasesByStatus);
router.get('/:id', authenticate, useCaseController.getUseCaseById);
router.post('/', authenticate, authorize('admin'), useCaseController.createUseCase);
router.put('/:id', authenticate, authorize('admin'), useCaseController.updateUseCase);
router.delete('/:id', authenticate, authorize('admin'), useCaseController.deleteUseCase);

export default router;
