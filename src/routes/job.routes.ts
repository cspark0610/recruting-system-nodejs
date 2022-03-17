import { Router } from 'express';
import { CreateJobDto } from '../db/schemas/dtos/Job';
import { requestBodyValidation } from '../middlewares/validators/requests';
import * as jobController from '../controllers/job.controller';
import * as authJwt from '../middlewares/authJwt.middleware';
import * as jobAuth from '../middlewares/Job.middleware';

const router = Router();

router.post(
  '/create',
  [
    authJwt.verifyJwt,
    authJwt.authRole({ CEO: 'CEO', CTO: 'CTO', 'RRHH ADMIN': 'RRHH ADMIN' }),
    requestBodyValidation(CreateJobDto),
    jobAuth.validateJobExists,
  ],
  jobController.createJob,
);

router.delete(
  '/delete/:_id',
  [
    authJwt.verifyJwt,
    authJwt.authRole({ CEO: 'CEO', CTO: 'CTO', 'RRHH ADMIN': 'RRHH ADMIN' }),
    jobAuth.verifyJobDeleted,
  ],
  jobController.deleteJob,
);

export default router;
