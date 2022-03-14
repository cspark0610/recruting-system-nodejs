import { Router } from 'express';
import multer from 'multer';
import storage from '../lib/multerConfig';
import * as candidateController from '../controllers/candidate.controller';
import * as videoController from '../controllers/video.controller';
import validateCandidateCreation from '../middlewares/validators/validateCandidateCreation';

const router = Router();

const upload = multer({ storage });

router.get('/cv/:key', candidateController.getCV);
router.get('/video/:key', videoController.getVideoFromS3);

router.post(
  '/create',
  upload.single('cv'),
  validateCandidateCreation,
  candidateController.createCandidate,
);
router.post(
  '/video/upload/:candidate_id',
  upload.single('video'),
  videoController.uploadVideoToS3,
);
router.post('/url/create', videoController.generateUniqueUrl);

router.delete('/url/delete/:url_id', videoController.deleteUrl);

export default router;
