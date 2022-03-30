import { Router } from 'express';
import {
  CreateUserDto,
  UpdateUserInfoDto,
  UpdatePasswordDto,
  UserSignInParamsDto,
} from '../db/schemas/dtos/User';
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

router.post(
  '/token/refresh',
  authJwt.verifyRefreshJwt,
  userController.refreshToken,
);

router.put(
  '/info/update/:_id',
  [authJwt.verifyJwt, requestBodyValidation(UpdateUserInfoDto)],
  userController.updateInfo,
);

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

router.put(
  '/password/change/:_id',
  [
    authJwt.verifyJwt,
    requestBodyValidation(UpdatePasswordDto),
    userAuth.validateNewPassword,
  ],
  userController.resetPassword,
);

export default router;
