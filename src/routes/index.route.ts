import { Request, Response, Router } from 'express';
import path from 'path';

import videoRoutes from './video.route';

const router = Router();

router.get('record', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.use('/video', videoRoutes);

export default router;
