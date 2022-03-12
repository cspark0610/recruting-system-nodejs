import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import validateSignUp from '../middlewares/validators/User/validateSignUp';
import validateSignIn from '../middlewares/validators/User/validateSignIn';

const router = Router();

router.post('/signIn', validateSignIn, userController.signIn);
router.post('/signUp', validateSignUp, userController.signUp);

export default router;
