import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import validateUserExists from '../middlewares/validators/validateUserExists.middleware';
import requestBodyValidation from '../middlewares/validators/requestBodyValidation.middleware';
import CreateUserDto from '../db/schemas/dtos/CreateUserDto.dto';

const router = Router();

router.post('/signIn', userController.signIn);
router.post(
  '/signUp',
  requestBodyValidation(CreateUserDto),
  validateUserExists,
  userController.signUp,
);

export default router;
