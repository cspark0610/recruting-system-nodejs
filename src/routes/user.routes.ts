import { Router } from 'express';
import {
  ChangeRoleParamsDto,
  CreateUserDto,
  UserSignInParamsDto,
} from '../db/schemas/dtos/User';
import {
  requestBodyValidation,
  requestParamsValidation,
} from '../middlewares/validators/requests';
import * as userController from '../controllers/user.controller';
import * as userAuth from '../middlewares/User.middleware';
import * as authJwt from '../middlewares/authJwt.middleware';

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

router.put(
  '/role/change/:_id',
  [
    requestParamsValidation(ChangeRoleParamsDto),
    authJwt.verifyJwt,
    authJwt.authRole({ CEO: 'CEO' }),
    userAuth.validateNewRole,
  ],
  userController.changeRole,
);

export default router;
