import { Router } from 'express';
import multer from 'multer';
import storage from '../lib/multerConfig';

import * as videoController from '../controllers/video.controller';

const upload = multer({ storage });

const router = Router();

router.get('/get/:key', videoController.getVideoFromS3);

router.post(
  '/upload/:candidate_id',
  upload.single('video'),
  videoController.uploadVideoToS3,
);

router.post('/url/create', videoController.generateUniqueUrl);
router.delete('/url/delete/:url_id', videoController.deleteUrl);

export default router;
