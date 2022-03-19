import { Router } from 'express';

import candidateRoutes from './candidate.routes';
import jobRoutes from './job.routes';
import userRoutes from './user.routes';

import getKeys from '../controllers/keys.controller';
import NotFoundException from '../exceptions/NotFoundException';

const router = Router();

router.get('/video-key', getKeys);

router.use('/candidate', candidateRoutes);
router.use('/job', jobRoutes);
router.use('/users', userRoutes);

router.use('*', (_req, _res, next) =>
  next(new NotFoundException('This page does not exist')),
);

export default router;
