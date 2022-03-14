import { Router } from 'express';
import multer from 'multer';
import storage from '../lib/multerConfig';
import * as candidateController from '../controllers/candidate.controller';
import requestBodyValidation from '../middlewares/validators/requests/requestBodyValidation.middleware';
import CreateCandidateDto from '../db/schemas/dtos/CreateCandidate.dto';

const router = Router();

const upload = multer({ storage });

router.get('/cv/:key', candidateController.getCV);
router.get('/video/:key', candidateController.getVideoFromS3);

router.post(
  '/create',
  upload.single('cv'),
  requestBodyValidation(CreateCandidateDto),
  candidateController.createCandidate,
);
router.post(
  '/video/upload/:candidate_id',
  upload.single('video'),
  candidateController.uploadVideoToS3,
);
router.post('/url/create', candidateController.generateUniqueUrl);

router.delete('/url/delete/:url_id', candidateController.deleteUrl);

export default router;
