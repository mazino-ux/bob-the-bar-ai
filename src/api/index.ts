import express from 'express';
import V1Router from './v1/routes';

const AppRouter = express.Router();

AppRouter.use('/v1', V1Router);

export default AppRouter;
