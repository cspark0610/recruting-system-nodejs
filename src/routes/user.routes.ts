import { Router } from 'express';
import signUp from '../controllers/user.controller';

const router = Router();

router.post('/signUp', signUp);

export default router;
