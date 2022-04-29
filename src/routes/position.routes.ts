import { Router } from 'express';
import {
  CreatePositionDto,
  UpdatePositionDto,
} from '../db/schemas/dtos/Position';
import { requestBodyValidation } from '../middlewares/validators/requests';
import * as positionController from '../controllers/position.controller';
import * as authJwt from '../middlewares/authJwt.middleware';
import * as positionAuth from '../middlewares/Position.middleware';

const router = Router();

router.get('/', positionController.getAllPositions);

router.get(
  '/:_id',
  positionAuth.verifyPositionIsActive,
  positionController.getPositionInfo,
);

router.post(
  '/create',
  [
    authJwt.verifyJwt,
    authJwt.authRole({ CEO: 'CEO', CTO: 'CTO', 'RRHH ADMIN': 'RRHH ADMIN' }),
    requestBodyValidation(CreatePositionDto),
    positionAuth.validatePositionExists,
  ],
  positionController.create,
);

router.put(
  '/update/:_id',
  [
    authJwt.verifyJwt,
    authJwt.authRole({ CEO: 'CEO', 'RRHH ADMIN': 'RRHH ADMIN' }),
    requestBodyValidation(UpdatePositionDto),
  ],
  positionController.updateInfo,
);

router.put(
  '/status/update/:_id',
  authJwt.verifyJwt,
  authJwt.authRole({ CEO: 'CEO', CTO: 'CTO', 'RRHH ADMIN': 'RRHH ADMIN' }),
  positionController.setIsActive,
);

router.delete(
  '/delete/:_id',
  [
    authJwt.verifyJwt,
    authJwt.authRole({ CEO: 'CEO', CTO: 'CTO', 'RRHH ADMIN': 'RRHH ADMIN' }),
    positionAuth.verifyPositionDeleted,
  ],
  positionController.deletePosition,
);

export default router;
