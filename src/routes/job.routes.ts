import { Router } from 'express';
import * as jobController from '../controllers/job.controller';
import CreateJobDto from '../db/schemas/dtos/CreateJobDto.dto';
import * as authJwt from '../middlewares/validators/authJwt.middleware';
import requestBodyValidation from '../middlewares/validators/requests/requestBodyValidation.middleware';
import validateJobExists from '../middlewares/validators/validateJobExists.middleware';
import verifyJobDeleted from '../middlewares/validators/verifyJobDeleted.middleware';

const router = Router();

router.post(
  '/create',
  [
    authJwt.verifyJwt,
    authJwt.authRole({ CEO: 'CEO', CTO: 'CTO', 'RRHH ADMIN': 'RRHH ADMIN' }),
    requestBodyValidation(CreateJobDto),
    validateJobExists,
  ],
  jobController.createJob,
);

router.delete(
  '/delete/:_id',
  [
    authJwt.verifyJwt,
    authJwt.authRole({ CEO: 'CEO', CTO: 'CTO', 'RRHH ADMIN': 'RRHH ADMIN' }),
    verifyJobDeleted,
  ],
  jobController.deleteJob,
);

export default router;
