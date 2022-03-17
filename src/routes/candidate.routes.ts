import { Router } from 'express';
import multer from 'multer';
import storage from '../lib/multerConfig';
import {
  requestBodyValidation,
  requestParamsValidation,
  requestQueryValidation,
} from '../middlewares/validators/requests';
import {
  CreateCandidateDto,
  JwtValidationDto,
  UpdateCandidateInfoDto,
} from '../db/schemas/dtos/Candidate';
import * as candidateController from '../controllers/candidate.controller';
import * as candidateAuth from '../middlewares/Candidate.middleware';
import * as authJwt from '../middlewares/authJwt.middleware';
import ValidateUrlParamsDto from '../db/schemas/dtos/ValidateUrlParams.dto';

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
    candidateAuth.verifyCandidateExistsBeforeSignUp,
    candidateAuth.validateCV,
  ],
  candidateController.createCandidate,
);

router.post(
  '/video/upload/:candidate_id',
  [
    upload.single('video'),
    requestParamsValidation(ValidateUrlParamsDto),
    candidateAuth.verifyCandidateVideoEmptyBeforeUpload,
  ],
  candidateController.uploadVideoToS3,
);

router.post(
  '/url/create/:_id',
  [
    authJwt.verifyJwt,
    requestParamsValidation(ValidateUrlParamsDto),
    candidateAuth.verifyCandidateExistsBeforeUrlGeneration,
  ],
  candidateController.generateUniqueUrl,
);

router.post('/url/validate', [
  requestQueryValidation(JwtValidationDto),
  candidateAuth.validateCandidateJwt,
]);

router.put(
  '/info/update/:_id',
  [
    requestParamsValidation(ValidateUrlParamsDto),
    requestBodyValidation(UpdateCandidateInfoDto),
  ],
  candidateController.updateCandidateInfo,
);

router.delete(
  '/url/delete/:url_id',
  candidateAuth.verifyCandidateVideoUrlExistsBeforeDeletion,
  candidateController.deleteUrl,
);

export default router;
