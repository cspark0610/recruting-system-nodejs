import { Router } from 'express';
import signUp from '../controllers/user.controller';
import validateSignUp from '../middlewares/validators/User/validateSignUp';

const router = Router();

router.post('/signUp', validateSignUp, signUp);

export default router;
