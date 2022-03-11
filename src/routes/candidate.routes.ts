import { Router } from 'express';
import multer from 'multer';
import storage from '../lib/multerConfig';
import * as candidateController from '../controllers/candidate.controller';
import validateCandidateCreation from '../middlewares/validators/validateCandidateCreation';

const router = Router();

const upload = multer({ storage });

router.get('/get-cv/:key', candidateController.getCV);

router.post(
  '/create',
  upload.single('cv'),
  validateCandidateCreation,
  candidateController.createCandidate,
);

export default router;
