import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import * as userAuth from '../middlewares/User.middleware';
import requestBodyValidation from '../middlewares/validators/requests/requestBodyValidation.middleware';
import { CreateUserDto, UserSignInParamsDto } from '../db/schemas/dtos/User';

const router = Router();

router.post(
  '/signIn',
  [requestBodyValidation(UserSignInParamsDto)],
  userController.signIn,
);
router.post(
  '/signUp',
  [requestBodyValidation(CreateUserDto), userAuth.validateSignUp],
  userController.signUp,
);

router.put(
  '/role/change/:_id',
  userAuth.validateNewRole,
  userController.changeRole,
);

export default router;
