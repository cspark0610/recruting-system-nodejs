import { Router } from 'express';
import path from 'path';

import videoRoutes from './video.routes';
import urlRoutes from './url.routes';
import cvRoutes from './cv.routes';
import getKeys from '../controllers/keys.controller';

const router = Router();

router.get('', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

router.get('/video-key', getKeys);

router.get('/url/not-found', (_req, res) => {
  res.status(404).render('pages/pageNotFound');
});

router.use('/video', videoRoutes);
router.use('/url', urlRoutes);
router.use('/cv', cvRoutes);

export default router;
