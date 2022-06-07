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

router.get('/', authJwt.verifyJwt, positionController.getAllPositions);

router.get(
  '/:_id',
  [authJwt.verifyJwt, positionAuth.verifyPositionIsActive],
  positionController.getPositionInfo,
);

router.post(
  '/',
  [
    authJwt.verifyJwt,
    requestBodyValidation(CreatePositionDto),
    positionAuth.validatePositionExists,
  ],
  positionController.create,
);

router.put(
  '/:_id',
  [authJwt.verifyJwt, requestBodyValidation(UpdatePositionDto)],
  positionController.updateInfo,
);

router.put('/status/:_id', authJwt.verifyJwt, positionController.setIsActive);

router.delete(
  '/:_id',
  [authJwt.verifyJwt, positionAuth.verifyPositionDeleted],
  positionController.deletePosition,
);

export default router;
