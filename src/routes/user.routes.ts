import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import validateSignUp from '../middlewares/validators/User/validateSignUp';
import validateSignIn from '../middlewares/validators/User/validateSignIn';
import requestBodyValidation from '../middlewares/validators/requestBodyValidation.middleware';
import CreateUserDto from '../db/schemas/dtos/CreateUserDto.dto';

const router = Router();

router.post('/signIn', validateSignIn, userController.signIn);
router.post(
  '/signUp',
  requestBodyValidation(CreateUserDto),
  validateSignUp,
  userController.signUp,
);

export default router;
