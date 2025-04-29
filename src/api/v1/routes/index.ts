import { Router } from 'express';
import bottleRoutes from './bottle.routes';
import collectionRoutes from './collection.routes';

const router = Router();

// V1 API ROUTES
router.use('/bottles', bottleRoutes);
router.use('/collection', collectionRoutes);

export default router;