import { Router } from 'express';
import { CreateUserDto, UserSignInParamsDto } from '../db/schemas/dtos/User';
import {
  requestBodyValidation,
  requestParamsValidation,
} from '../middlewares/validators/requests';
import * as userController from '../controllers/user.controller';
import * as userAuth from '../middlewares/User.middleware';
import * as authJwt from '../middlewares/authJwt.middleware';
import ValidateUrlParamsDto from '../db/schemas/dtos/ValidateUrlParams.dto';

const router = Router();

router.get(
  '/',
  [authJwt.verifyJwt, authJwt.authRole({ CEO: 'CEO' })],
  userController.getAllUsers,
);

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

router.post('/token/refresh', userController.refreshToken);

router.put(
  '/role/change/:_id',
  [
    requestParamsValidation(ValidateUrlParamsDto),
    authJwt.verifyJwt,
    authJwt.authRole({ CEO: 'CEO' }),
    userAuth.validateNewRole,
  ],
  userController.changeRole,
);

export default router;
