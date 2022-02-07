import { Router } from 'express';

import videoRoutes from './video.routes';
import urlRoutes from './url.routes';

const router = Router();

router.get('', (_req, res) => {
  res.render('pages/index');
});

router.get('/url/not-found', (_req, res) => {
  res.status(404).render('pages/pageNotFound');
});

router.use('/video', videoRoutes);
router.use('/url', urlRoutes);

export default router;
