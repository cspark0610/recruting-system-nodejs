import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import validateUserExists from '../middlewares/validators/validateUserExists.middleware';
import requestBodyValidation from '../middlewares/validators/requests/requestBodyValidation.middleware';
import CreateUserDto from '../db/schemas/dtos/CreateUserDto.dto';
import UserSignInParamsDto from '../db/schemas/dtos/UserSignInParamsDto.dto';
import verifyJwt from '../middlewares/validators/authJwt/validateJwt.middleware';

const router = Router();

router.post(
  '/signIn',
  requestBodyValidation(UserSignInParamsDto),
  verifyJwt,
  userController.signIn,
);
router.post(
  '/signUp',
  requestBodyValidation(CreateUserDto),
  validateUserExists,
  userController.signUp,
);

export default router;
