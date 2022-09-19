import { Router } from "express";
import multer from "multer";
import { storage } from "../config";

// dtos
import { UpdatePostulationInfoDto } from "../db/schemas/dtos/Candidate/UpdatePostulationInfoDto.dto";
import ValidatePostulationUrlParams from "../db/schemas/dtos/ValidatePostulationUrlParams.dto";
import { UpdateStatusDto } from "../db/schemas/dtos/Candidate/UpdateStatusDto.dto";

//middlewares
import { requestBodyValidation, requestParamsValidation } from "../middlewares/validators/requests";
import * as authJwt from "../middlewares/authJwt.middleware";
import * as postulationAuth from "../middlewares/Postulation.middleware";

//controllers
import * as postulationController from "../controllers/postulation.controller";

const router = Router();
const upload = multer({ storage });

/**
 * ruta para actualizar los campos del schema postulation
 */
router.put(
	"/info/update/:_id",
	[
		requestParamsValidation(ValidatePostulationUrlParams),
		requestBodyValidation(UpdatePostulationInfoDto),
	],
	postulationController.updateInfo
);

/**
 * ruta para actualizar el main_status y secondary_status de la postulacion con id: _id
 */
router.put(
	"/status/update/:_id",
	[authJwt.verifyJwt, requestBodyValidation(UpdateStatusDto)],
	postulationController.UpdatePostulationStatus
);

/**
 * ruta para crear el url_link_2 asociado a un postulacion con id: _id
 */
router.post(
	"/url/create/:_id",
	[
		authJwt.verifyJwt,
		requestParamsValidation(ValidatePostulationUrlParams),
		postulationAuth.verifyPostulationExistsBeforeUrlGeneration as any,
	],
	postulationController.generateUniqueUrl
);

/**
 * ruta para deshabilitar el url_link_2 asociado a un postulacion con id: _id
 */
router.put(
	"/url/disable/:url_id",
	postulationAuth.verifyIfPostulationUrlIsDisabled as any,
	postulationController.disableUrl
);

/**
 * ruta para obtener un video de S3
 */
router.get("/video/:key", authJwt.verifyJwt, postulationController.getVideoFromS3);

/**
 * ruta para crear un video en S3
 */
router.post(
	"/video/:postulation_id",
	[upload.single("video"), requestParamsValidation(ValidatePostulationUrlParams)],
	postulationController.uploadVideoToS3
);

export default router;
