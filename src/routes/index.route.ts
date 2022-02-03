import { Request, Response, Router } from 'express';
import path from 'path';
import multer from 'multer';
import storage from '../lib/multerConfig';
import saveVideoToS3 from '../controllers/video.controller';

const router = Router();

const upload = multer({ storage: storage });

router.get('', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.post('/video/save', upload.single('video'), saveVideoToS3);

export default router;
