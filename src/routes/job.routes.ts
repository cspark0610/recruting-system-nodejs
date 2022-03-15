import { Router } from 'express';
import createJob from '../controllers/job.controller';
import CreateJobDto from '../db/schemas/dtos/CreateJobDto.dto';
import * as authJwt from '../middlewares/validators/authJwt.middleware';
import requestBodyValidation from '../middlewares/validators/requests/requestBodyValidation.middleware';
import validateJobExists from '../middlewares/validators/validateJobExists.middleware';

const router = Router();

router.post(
  '/create',
  [
    authJwt.verifyJwt,
    authJwt.authRole({ CEO: 'CEO', CTO: 'CTO', 'RRHH ADMIN': 'RRHH ADMIN' }),
    requestBodyValidation(CreateJobDto),
    validateJobExists,
  ],
  createJob,
);

export default router;
