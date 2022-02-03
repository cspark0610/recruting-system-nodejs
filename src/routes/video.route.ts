import { Router, Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import storage from '../lib/multerConfig';
import {
  uploadVideoToS3,
  getVideoFromS3,
} from '../controllers/video.controller';

const router = Router();

const upload = multer({ storage: storage });

router.get('/record', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/get/:key', getVideoFromS3);

router.post('/save', upload.single('video'), uploadVideoToS3);

export default router;
