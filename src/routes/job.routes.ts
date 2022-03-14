import { Router } from 'express';
import { createJob, setCandidate } from '../controllers/job.controller';
import * as authJwt from '../middlewares/validators/authJwt.middleware';
import validateJobExists from '../middlewares/validators/validateJobExists.middleware';

const router = Router();

router.post(
  '/create',
  [authJwt.verifyJwt, authJwt.isCEO, validateJobExists],
  createJob,
);
router.put('/setCandidate/:_id', setCandidate);

export default router;
