import { Router } from 'express';
import { createJob, setCandidate } from '../controllers/job.controller';
import validateJobExists from '../middlewares/validators/Job/validateJobExists';

const router = Router();

router.post('/create', validateJobExists, createJob);
router.put('/setCandidate/:_id', setCandidate);

export default router;
