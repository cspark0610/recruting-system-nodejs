import { Router } from 'express';
import path from 'path';

import videoRoutes from './video.route';

const router = Router();

router.get('', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

//router.get(':shortUrl', (req: Request, res: Response) => {
//res.status(404).send({
//status: 'failure',
//code: 404,
//message: 'cannot GET /',
//});
//});

router.use('/video', videoRoutes);

export default router;
