import { Router } from 'express';
import multer from 'multer';
import storage from '../lib/multerConfig';
import requestBodyValidation from '../middlewares/validators/requests/requestBodyValidation.middleware';
import CreateCandidateDto from '../db/schemas/dtos/CreateCandidate.dto';
import * as candidateController from '../controllers/candidate.controller';
import * as candidateAuth from '../middlewares/Candidate.middleware';
import * as authJwt from '../middlewares/authJwt.middleware';
import UpdateCandidateInfoDto from '../db/schemas/dtos/UpdateCandidateInfoDto.dto';

const router = Router();

const upload = multer({ storage });

router.get('/', authJwt.verifyJwt, candidateController.getAllCandidates);
router.get('/:_id', authJwt.verifyJwt, candidateController.getOneCandidate);
router.get('/cv/:key', candidateController.getCV);
router.get('/video/:key', candidateController.getVideoFromS3);

router.post(
  '/create',
  [
    upload.single('cv'),
    requestBodyValidation(CreateCandidateDto),
    candidateAuth.verifyCandidateExists,
    candidateAuth.validateCV,
  ],
  candidateController.createCandidate,
);
router.post(
  '/video/upload/:candidate_id',
  upload.single('video'),
  candidateController.uploadVideoToS3,
);
router.post('/url/create', candidateController.generateUniqueUrl);

router.put(
  '/info/update/:_id',
  requestBodyValidation(UpdateCandidateInfoDto),
  candidateController.updateCandidateInfo,
);

router.delete('/url/delete/:url_id', candidateController.deleteUrl);

export default router;
