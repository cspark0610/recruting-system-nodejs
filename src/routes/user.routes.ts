import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import * as userAuth from '../middlewares/validators/User.middleware';
import requestBodyValidation from '../middlewares/validators/requests/requestBodyValidation.middleware';
import CreateUserDto from '../db/schemas/dtos/CreateUserDto.dto';
import UserSignInParamsDto from '../db/schemas/dtos/UserSignInParamsDto.dto';

const router = Router();

router.post(
  '/signIn',
  [requestBodyValidation(UserSignInParamsDto)],
  userController.signIn,
);
router.post(
  '/signUp',
  [requestBodyValidation(CreateUserDto), userAuth.default],
  userController.signUp,
);

export default router;
