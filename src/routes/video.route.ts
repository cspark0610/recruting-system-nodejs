import { Router } from 'express';
import multer from 'multer';
import storage from '../lib/multerConfig';
import { saveVideoToS3, getVideoFromS3 } from '../controllers/video.controller';

const router = Router();

const upload = multer({ storage: storage });

router.get('/get/:key', getVideoFromS3);

router.post('/save', upload.single('video'), saveVideoToS3);

export default router;
