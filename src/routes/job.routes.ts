import { Router } from 'express';
import { createJob, setCandidate } from '../controllers/job.controller';

const router = Router();

router.post('/create', createJob);
router.put('/setCandidate/:_id', setCandidate);

export default router;
