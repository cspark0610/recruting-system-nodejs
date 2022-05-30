import { Router } from 'express';

import candidateRoutes from './candidate.routes';
import positionRoutes from './position.routes';
import userRoutes from './user.routes';

import { NotFoundException } from '../exceptions';

const router = Router();

router.use('/candidate', candidateRoutes);
router.use('/position', positionRoutes);
router.use('/users', userRoutes);

router.use('*', (_req, _res, next) => {
  return next(new NotFoundException('This route does not exist'));
});

export default router;
