import { Router } from 'express';
import { createJob, setCandidate } from '../controllers/job.controller';
import CreateJobDto from '../db/schemas/dtos/CreateJobDto.dto';
import * as authJwt from '../middlewares/validators/authJwt.middleware';
import requestBodyValidation from '../middlewares/validators/requests/requestBodyValidation.middleware';
import validateJobExists from '../middlewares/validators/validateJobExists.middleware';

const router = Router();

router.post(
  '/create',
  [
    authJwt.verifyJwt,
    authJwt.JobAuthorization,
    requestBodyValidation(CreateJobDto),
    validateJobExists,
  ],
  createJob,
);
router.put('/setCandidate/:_id', setCandidate);

export default router;
