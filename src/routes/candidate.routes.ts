import { Router } from 'express';
import multer from 'multer';
import storage from '../config/multer';
import {
  requestBodyValidation,
  requestParamsValidation,
  requestQueryValidation,
} from '../middlewares/validators/requests';
import {
  CreateCandidateDto,
  JwtValidationDto,
  UpdateCandidateInfoDto,
  UpdateConclusionsDto,
  UpdateStatusDto,
} from '../db/schemas/dtos/Candidate';
import * as candidateController from '../controllers/candidate.controller';
import * as candidateAuth from '../middlewares/Candidate.middleware';
import * as authJwt from '../middlewares/authJwt.middleware';
import ValidateUrlParamsDto from '../db/schemas/dtos/ValidateUrlParams.dto';

const router = Router();

const upload = multer({ storage });

/**
 * @openapi
 * "tags": [
 *  {
 *   "name": "Candidate",
 *   "description": "Candidate routes"
 *  },
 * ]
 * */

router.get('/', authJwt.verifyJwt, candidateController.getAllCandidates);

router.get('/filter', candidateController.getCandidatesFiltered);

router.get('/:_id', authJwt.verifyJwt, candidateController.getOneCandidate);
router.get('/cv/:key', candidateController.getCV);
router.get('/video/:key', candidateController.getVideoFromS3);

/**
 * @openapi
 * "/candidate/create": {
 *  "post": {
 *   "tags": ["Candidate"],
 *   "summary": "Create a new candidate",
 *   "requestBody": {
 *    "required": true,
 *    "content": {
 *    "application/json": {
 *     "schema": {
 *      "$ref": "#/components/schemas/Candidate creation model",
 *     },
 *    },
 *   },
 *  },
 *  "responses": {
 *   "201": {
 *    "description": "Returns created candidate",
 *    "content": {
 *     "application/json": {
 *      "schema": {
 *       "$ref": "#/components/schemas/Candidate creation model response",
 *      },
 *     },
 *    },
 *   },
 *  },
 * },
 * }
 * */
router.post(
  '/create',
  [
    upload.single('cv'),
    requestBodyValidation(CreateCandidateDto),
    candidateAuth.verifyCandidateExistsBeforeSignUp,
    candidateAuth.validateCV,
  ],
  candidateController.create,
);

router.post(
  '/video/upload/:candidate_id',
  [upload.single('video'), requestParamsValidation(ValidateUrlParamsDto)],
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

router.post(
  '/url/validate',
  [
    requestQueryValidation(JwtValidationDto),
    candidateAuth.validateCandidateJwt,
  ],
  candidateController.validateUrl,
);

/**
 * @openapi
 * "/candidate/info/update/{_id}": {
 *  "put": {
 *   "tags": ["Candidate"],
 *   "summary": "Update candidate information via link 2",
 *   "parameters": [
 *    {
 *     "name": "_id",
 *     "in": "path",
 *     "required": true,
 *     "type": "mongodb ObjectId",
 *     "format": "mongodb id",
 *     "description": "Candidate id",
 *    },
 *   ],
 *   "requestBody": {
 *    "required": true,
 *    "content": {
 *     "application/json": {
 *      "schema": {
 *       "$ref": "#/components/schemas/Candidate update model",
 *      },
 *     },
 *    },
 *   },
 *   "responses": {
 *    "200": {
 *     "description": "Candidate updated successfully",
 *    },
 *    "400": {
 *     "description": "Bad request when required fields are not provided. Or when they have invalid information. Or when _id is not valid",
 *    },
 *   },
 *  },
 * }
 * */
router.put(
  '/info/update/:_id',
  [
    requestParamsValidation(ValidateUrlParamsDto),
    requestBodyValidation(UpdateCandidateInfoDto),
  ],
  candidateController.updateInfo,
);

router.put(
  '/status/update/:_id',
  [authJwt.verifyJwt, requestBodyValidation(UpdateStatusDto)],
  candidateController.updateStatus,
);

router.put(
  '/conclusions/set/:_id',
  [authJwt.verifyJwt, requestBodyValidation(UpdateConclusionsDto)],
  candidateController.updateConclusions,
);

router.put(
  '/reject/:_id',
  [
    authJwt.verifyJwt,
    authJwt.authRole({
      CEO: 'CEO',
      CTO: 'CTO',
      'RRHH ADMIN': 'RRHH ADMIN',
      RRHH: 'RRHH',
    }),
  ],
  candidateController.setIsRejected,
);

router.delete(
  '/url/delete/:url_id',
  candidateAuth.verifyCandidateVideoUrlExistsBeforeDeletion,
  candidateController.deleteUrl,
);

export default router;
