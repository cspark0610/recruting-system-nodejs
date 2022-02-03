import { Request, Response, Router } from 'express';

import videoRoutes from './video.route';

const router = Router();

router.get(':shortUrl', (req: Request, res: Response) => {
  res.status(404).send({
    status: 'failure',
    code: 404,
    message: 'cannot GET /',
  });
});

router.use('/video', videoRoutes);

export default router;
