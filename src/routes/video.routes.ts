import { Router } from 'express';
import multer from 'multer';
import storage from '../lib/multerConfig';
import * as videoController from '../controllers/video.controller';

const upload = multer({ storage });

const router = Router();

router.get('/get/:key', videoController.getVideoFromS3);

router.post('/upload', upload.single('video'), videoController.uploadVideoToS3);

export default router;
