import { Router } from "express";
import multer from "multer";
import { storage } from "../config";
import {
	requestBodyValidation,
	// requestParamsValidation,
	requestQueryValidation,
} from "../middlewares/validators/requests";
import { CreateCandidateDto, JwtValidationDto } from "../db/schemas/dtos/Candidate";
import * as candidateController from "../controllers/candidate.controller";
import * as candidateAuth from "../middlewares/Candidate.middleware";
import * as postulationAuth from "../middlewares/Postulation.middleware";
import * as authJwt from "../middlewares/authJwt.middleware";

const router = Router();

const upload = multer({ storage });

/**
 * @openapi
 * "tags": [
 *  {
 *   "name": "Candidate",
 *   "description": "Candidate routes"
 *  },
 * ]
 * */

router.get("/", authJwt.verifyJwt, candidateController.getAllCandidates);

router.get("/:_id", authJwt.verifyJwt, candidateController.getOneCandidate);

/**
 * @openapi
 * "/candidate/create": {
 *  "post": {
 *   "tags": ["Candidate"],
 *   "summary": "Registers a new candidate. This corresponds to the LINK 1 flow",
 *   "requestBody": {
 *    "required": true,
 *    "content": {
 *    "multipart/form-data": {
 *     "schema": {
 *      "$ref": "#/components/schemas/Candidate creation",
 *     },
 *    },
 *   },
 *  },
 *  "responses": {
 *   "201": {
 *    "description": "Returns created candidate",
 *    "content": {
 *     "application/json": {
 *      "schema": {
 *       "$ref": "#/components/schemas/Candidate creation response",
 *      },
 *     },
 *    },
 *   },
 *   "400": {
 *    "description": "Bad request when the request body is not valid, alongide error messages related to request body validation. Or when there is already a candidate registered with the same email",
 *   },
 *   "500": {
 *    "description": "Internal server error",
 *   },
 *  },
 * },
 * }
 * */
router.post(
	"/create",
	[
		upload.single("cv"),
		requestBodyValidation(CreateCandidateDto),
		candidateAuth.verifyCandidateExistsBeforeSignUp,
		candidateAuth.validateCV,
	],
	candidateController.create
);

router.post("/filter", authJwt.verifyJwt, candidateController.getCandidatesFiltered);
router.post("/expert/filter", authJwt.verifyJwt, candidateController.getCandidatesFilteredExpert);

/**
 * valida el token del url_link_2
 */
router.post(
	"/url/validate",
	[requestQueryValidation(JwtValidationDto), postulationAuth.validatePostulationJwt as any],
	candidateController.validateUrl
);

/**
 * @openapi
 * "/candidate/url/create/{_id}": {
 *  "post": {
 *   "tags": ["Candidate"],
 *   "summary": "Create an url link for the candidate to complete their application in postulation with id ${id}",
 *   "security": [
 *    {
 *     "bearerAuth": [],
 *    },
 *   ],
 *   "parameters": [{
 *    "name": "_id",
 *    "in": "path",
 *    "description": "Candidate Id",
 *    "required": true,
 *    "type": "ObjectId",
 *    "format": "ObjectId",
 *   }],
 *   "responses": {
 *    "201": {
 *     "description": "Returns created url",
 *     "content": {
 *      "application/json": {
 *       "schema": {
 *        "$ref": "#/components/schemas/Create candidate URL response",
 *       },
 *      },
 *     },
 *    },
 *    "401": {
 *     "description": "Unauthorized when the user is not logged in or when the access token or refresh token has expired",
 *    },
 *    "500": {
 *     "description": "Internal server error",
 *    },
 *   },
 *  },
 * }
 * */

//@openapi
/**
 * "/candidate/info/update/{_id}": {
 *  "put": {
 *   "tags": ["Candidate"],
 *   "summary": "Update candidate information via LINK 2 form",
 *   "parameters": [
 *    {
 *     "name": "_id",
 *     "in": "path",
 *     "required": true,
 *     "type": "mongodb ObjectId",
 *     "format": "mongodb id",
 *     "description": "Candidate id",
 *    },
 *   ],
 *   "requestBody": {
 *    "required": true,
 *    "content": {
 *     "application/json": {
 *      "schema": {
 *       "$ref": "#/components/schemas/Candidate update",
 *      },
 *     },
 *    },
 *   },
 *   "responses": {
 *    "200": {
 *     "description": "Candidate updated successfully",
 *    },
 *    "400": {
 *     "description": "Bad request when required fields are not provided. Or when they have invalid information. Or when _id is not valid",
 *    },
 *    "500": {
 *     "description": "Internal server error",
 *    },
 *   },
 *  },
 * }
 * */

/**
 * ruta para actualizar el campo "conclusions" de un Candidate
 */
router.put("/conclusions/set/:_id", [authJwt.verifyJwt], candidateController.updateConclusions);

/**
 * ruta para actualizar campo employment_status del Candidate
 */
router.put(
	"/employment_status/update/:_id",
	[authJwt.verifyJwt],
	candidateController.updateCandidateEmploymentStatus
);

/**
 * ruta para actualizar el campo "isRejected" de un Candidate a true
 */
router.put("/reject/:_id", [authJwt.verifyJwt], candidateController.setIsRejected);

export default router;
