import { Router } from 'express';
import path from 'path';

import videoRoutes from './video.routes';
import urlRoutes from './url.routes';
import candidateRoutes from './candidate.routes';
import jobRoutes from './job.routes';
import userRoutes from './user.routes';

import getKeys from '../controllers/keys.controller';

import validateBaseUrl from '../middlewares/validators/validateBaseUrl';

const router = Router();

router.get('', validateBaseUrl, (_req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

router.get('/video-key', getKeys);

router.use('/video', videoRoutes);
router.use('/url', urlRoutes);
router.use('/candidate', candidateRoutes);
router.use('/job', jobRoutes);
router.use('/users', userRoutes);

export default router;
