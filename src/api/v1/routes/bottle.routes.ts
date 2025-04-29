import { Router } from 'express';
import { BottleController } from '../controllers/BottleController';
import { createBottleSchema, validateRequest } from '../../../middleware/validateRequest';

const router = Router();

// BOTTLE ROUTES
router.post('/', validateRequest(createBottleSchema), BottleController.createBottle);
router.get('/', BottleController.getAllBottles);
router.get('/:id', BottleController.getBottleById);

export default router;