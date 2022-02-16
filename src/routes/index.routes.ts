import { Router, Request, Response } from 'express';

import videoRoutes from './video.routes';
import urlRoutes from './url.routes';

const router = Router();

router.get('', (_req, res) => {
  res.status(404).render('pages/pageNotFound');
});

router.get('/view', (_req: Request, res: Response) => res.render('pages/viewVideo'));

router.get('/url/not-found', (_req, res) => {
  res.status(404).render('pages/pageNotFound');
});

router.use('/video', videoRoutes);
router.use('/url', urlRoutes);

export default router;
