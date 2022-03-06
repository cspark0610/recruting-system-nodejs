import { Router } from 'express';
import multer from 'multer';
import storage from '../lib/multerConfig';

import * as videoController from '../controllers/video.controller';

import validateUser from '../middlewares/validators/validateUserId';

const upload = multer({ storage });

const router = Router();

router.get('/get/:key', videoController.getVideoFromS3);
router.get('/view/:candidateId', validateUser, videoController.getVideo);

router.post(
  '/upload/:candidate_id',
  upload.single('video'),
  videoController.uploadVideoToS3,
);

export default router;
