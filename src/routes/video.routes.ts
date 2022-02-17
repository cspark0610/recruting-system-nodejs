import { Router } from 'express';
import multer from 'multer';
import storage from '../lib/multerConfig';
import validateUser from '../middlewares/validateUserId';
import * as videoController from '../controllers/video.controller';

const upload = multer({ storage });

const router = Router();

router.get('/get/:key', videoController.getVideoFromS3);

router.get('/view/:userId', validateUser, videoController.getVideo);

router.post('/upload', upload.single('video'), videoController.uploadVideoToS3);

export default router;
