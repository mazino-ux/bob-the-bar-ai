import { Router } from 'express';
import { CollectionController } from '../controllers/CollectionController';
import { analyzeCollectionSchema, validateRequest } from '../../../middleware/validateRequest';

const router = Router();

// COLLECTION ANALYSIS ROUTES
router.post('/analyze', validateRequest(analyzeCollectionSchema), CollectionController.analyzeCollection);
router.post('/recommendations', validateRequest(analyzeCollectionSchema), CollectionController.getRecommendations);

export default router;