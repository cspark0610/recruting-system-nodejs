import { Router } from 'express';

import videoRoutes from './video.routes';
import urlRoutes from './url.routes';

const router = Router();

router.get('', (_req, res) => {
  res.render('pages/index');
});

router.use('/video', videoRoutes);
router.use('/url', urlRoutes);

export default router;
