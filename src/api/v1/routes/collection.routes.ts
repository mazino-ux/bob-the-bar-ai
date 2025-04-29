import { Router } from 'express';
import { CollectionController } from '../controllers/CollectionController';
import { validateRequest } from '../../../middleware/validateRequest';
import { analyzeCollectionSchema } from '../../../validations/collection.validation';

const router = Router();

// COLLECTION ANALYSIS ROUTES
router.post('/analyze', validateRequest(analyzeCollectionSchema), CollectionController.analyzeCollection);
router.post('/recommendations', validateRequest(analyzeCollectionSchema), CollectionController.getRecommendations);

export default router;