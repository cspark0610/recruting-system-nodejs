import { Router } from 'express';
import multer from 'multer';
import storage from '../lib/multerConfig';
import createCandidate from '../controllers/candidate.controller';
import validateCandidateCreation from '../middlewares/validators/validateCandidateCreation';

const router = Router();

const upload = multer({ storage });

router.post(
  '/create',
  upload.single('cv'),
  validateCandidateCreation,
  createCandidate,
);

export default router;
