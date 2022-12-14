/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { IUser } from "../db/schemas/interfaces/User";
import { createToken } from "../lib/jwt";
import { envConfig } from "../config";
import { InternalServerException } from "../exceptions";
import { RequestExtended } from "../interfaces";
import * as userService from "../services/User.service";

const { JWT_ACCESS_TOKEN_EXP, JWT_REFRESH_TOKEN_EXP } = envConfig;

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await userService.GetAllUsers(next);

		return res.status(200).send({ status: 200, allUsers: users });
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the getAllUsers controller. ${e.message}`
			)
		);
	}
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password, tokenId } = req.body;

	try {
		if (tokenId) {
			const data = await userService.SignUpGoogle(tokenId, next);

			if (!data) {
				return next(
					new InternalServerException("There was an error signing in. Please try again.")
				);
			}

			res.cookie("refresh", data.refreshToken, {
				httpOnly: true,
				sameSite: "none",
				secure: true,
				expires: new Date(Date.now() + JWT_REFRESH_TOKEN_EXP),
				maxAge: 1000 * 60 * 60 * 24 * 2,
			});

			return res.status(200).send({
				status: 200,
				access_token: data.accessToken,
				user: data.userWithouthPassword,
			});
		}

		const data = await userService.SignIn({ email, password }, next);

		if (!data) {
			return next(new InternalServerException("There was an error signing in. Please try again."));
		}

		res.cookie("refresh", data.refreshToken, {
			httpOnly: true,
			sameSite: "none",
			secure: true,
			expires: new Date(Date.now() + JWT_REFRESH_TOKEN_EXP),
			maxAge: 1000 * 60 * 60 * 24 * 2,
		});

		return res.status(200).send({
			status: 200,
			access_token: data.accessToken,
			user: data.userWithouthPassword,
		});
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the signIn controller. ${e.message}`
			)
		);
	}
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userInfo: IUser = req.body;
		const data = await userService.SignUp(userInfo, next);

		if (!data) {
			return next(new InternalServerException("There was an error signing up."));
		}

		res.cookie("refresh", data.refreshToken, {
			httpOnly: true,
			sameSite: "none",
			secure: true,
			expires: new Date(Date.now() + JWT_REFRESH_TOKEN_EXP),
			maxAge: 1000 * 60 * 60 * 24 * 2,
		});

		return res.status(201).send({
			status: 201,
			access_token: data.accessToken,
			user: data!.userWithouthPassword,
		});
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the signUp controller. ${e.message}`
			)
		);
	}
};

export const signOut = async (_req: RequestExtended, res: Response, _next: NextFunction) => {
	res.clearCookie("refresh", {
		httpOnly: true,
		sameSite: "none",
		secure: true,
	});
	return res.sendStatus(204);
};

export const updateInfo = async (req: Request, res: Response, next: NextFunction) => {
	const newInfo: IUser = req.body;
	const { _id } = req.params;

	try {
		const user = await userService.UpdateInfo(_id, newInfo, next);

		return res.status(200).send({
			status: 200,
			message: "User updated successfully",
			user,
		});
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the update user info controller. ${e.message}`
			)
		);
	}
};

export const refreshToken = async (req: RequestExtended, res: Response, next: NextFunction) => {
	try {
		const { user } = req;

		const accessToken = createToken(user!, JWT_ACCESS_TOKEN_EXP, "access");

		return res.status(200).send({ accessToken });
	} catch (e: any) {
		return next(new InternalServerException(e));
	}
};

export const changeRole = async (req: RequestExtended, res: Response, next: NextFunction) => {
	const { _id } = req.params;

	await userService.ChangeRole(_id, req.role!, next);

	return res.status(200).send({ status: 200, message: "User role updated successfully" });
};

export const resetPassword = async (req: RequestExtended, res: Response, next: NextFunction) => {
	const { _id } = req.params;
	const { new_password } = req.body;

	await userService.ResetPassword(_id, new_password, next);

	return res.status(200).send({ status: 200, message: "Password updated successfully" });
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	const { _id } = req.params;

	try {
		await userService.DeleteUser(_id, next);

		return res.status(200).send({ status: 200, message: "User deleted successfully" });
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the delete user controller. ${e.message}`
			)
		);
	}
};
