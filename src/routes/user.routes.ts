import { Router } from "express";
import {
	CreateUserDto,
	UpdateUserInfoDto,
	UpdatePasswordDto,
	UserSignInParamsDto,
} from "../db/schemas/dtos/User";
import { requestBodyValidation, requestParamsValidation } from "../middlewares/validators/requests";
import * as userController from "../controllers/user.controller";
import * as userAuth from "../middlewares/User.middleware";
import * as authJwt from "../middlewares/authJwt.middleware";
import ValidateRoleUrlParamsDto from "../db/schemas/dtos/ValidateRoleUrlParams.dto";

const passport = require("passport");

const router = Router();

/**
 * consent screen
 */
router.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);
/**
 * passport.authenticate("google") callback
 */
// router.get("/auth/google/callback", passport.authenticate("google"), (req, res) => {
// 	res.redirect("/apply");
// });

/**
 * @openapi
 * "tags": [
 *  {
 *   "name": "User",
 *   "description": "User related endpoints"
 *  },
 * ]
 * */

router.get("/", [authJwt.verifyJwt], userController.getAllUsers);

/**
 * @openapi
 * "/users/signIn": {
 *  "post": {
 *   "summary": "Sign in user",
 *   "description": "Sign in user",
 *   "tags": ["User"],
 *   "requestBody": {
 *   "required": true,
 *    "content": {
 *     "application/json": {
 *      "schema": {
 *       "$ref": "#/components/schemas/User signin schema"
 *      },
 *     },
 *    },
 *   },
 *   "responses": {
 *    "200": {
 *     "description": "User sing in successfull, alongside access and refresh tokens",
 *     "content": {
 *      "application/json": {
 *       "schema": {
 *        "$ref": "#/components/schemas/User sign up response schema"
 *       },
 *      },
 *     },
 *    },
 *    "400": {
 *     "description": "Bad request when email or password is not provided or is invalid",
 *    },
 *    "500": {
 *     "description": "Internal server error",
 *    },
 *   },
 *  },
 * }
 * */
router.post("/signIn", [requestBodyValidation(UserSignInParamsDto)], userController.signIn);

/**
 * @openapi
 * "/users/signUp": {
 *  "post": {
 *   "tags": ["User"],
 *   "summary": "Register a new User",
 *   "description": "Register a new User",
 *   "requestBody": {
 *    "required": true,
 *    "content": {
 *     "application/json": {
 *      "schema": {
 *       "$ref": "#/components/schemas/User signup schema"
 *      },
 *     },
 *    },
 *   },
 *   "responses": {
 *    "201": {
 *     "description": "User registered successfully, alongside access and refresh tokens",
 *     "content": {
 *      "application/json": {
 *       "schema": {
 *        "$ref": "#/components/schemas/User sign up response schema"
 *       },
 *      },
 *     },
 *    },
 *    "400": {
 *     "description": "Bad request when the form is invalid, or when the user already exists",
 *    },
 *    "500": {
 *     "description": "Internal server error",
 *    },
 *   },
 *  },
 * }
 *
 * */
router.post(
	"/signUp",
	[requestBodyValidation(CreateUserDto), userAuth.validateSignUp],
	userController.signUp
);

router.post("/signOut", userController.signOut);

router.post("/token/refresh", authJwt.verifyRefreshJwt, userController.refreshToken);

router.put(
	"/:_id",
	[authJwt.verifyJwt, requestBodyValidation(UpdateUserInfoDto)],
	userController.updateInfo
);

router.put(
	"/role/:_id",
	[
		authJwt.verifyJwt,
		authJwt.authRole({ CEO: "CEO" }),
		requestParamsValidation(ValidateRoleUrlParamsDto),
		userAuth.validateNewRole,
	],
	userController.changeRole
);

router.put(
	"/password/:_id",
	[authJwt.verifyJwt, requestBodyValidation(UpdatePasswordDto), userAuth.validateNewPassword],
	userController.resetPassword
);

router.delete("/:_id", [authJwt.verifyJwt], userController.deleteUser);

export default router;
