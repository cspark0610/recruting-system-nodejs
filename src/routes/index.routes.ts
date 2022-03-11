import { Router } from 'express';

import videoRoutes from './video.routes';
import candidateRoutes from './candidate.routes';
import jobRoutes from './job.routes';
import userRoutes from './user.routes';

import getKeys from '../controllers/keys.controller';

const router = Router();

router.get('/video-key', getKeys);

router.use('/video', videoRoutes);
router.use('/candidate', candidateRoutes);
router.use('/job', jobRoutes);
router.use('/users', userRoutes);

export default router;
