/* eslint-disable func-names */
/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
import { Response, NextFunction } from "express";
import { decodeToken } from "../lib/jwt";
import {
	InvalidAccessToken,
	InvalidRefreshToken,
	ForbiddenException,
	BadRequestException,
} from "../exceptions";
import { RequestExtended } from "../interfaces";
import User from "../db/schemas/User.schema";
import Role from "../db/schemas/Role.schema";

// checks if a JWT is valid
export async function verifyJwt(req: RequestExtended, _res: Response, next: NextFunction) {
	const accessToken = req.headers.authorization?.split(" ").pop();

	if (!accessToken || accessToken === "Bearer") {
		return next(new BadRequestException("No access token provided"));
	}

	try {
		const decoded = decodeToken(accessToken, "access");

		const userFound = await User.findById(decoded._id, { password: 0 });

		if (!userFound) {
			return next(new InvalidAccessToken());
		}

		req.user = userFound;
	} catch (e: any) {
		return next(new InvalidAccessToken("Invalid access token"));
	}

	next();
}

export async function verifyRefreshJwt(req: RequestExtended, _res: Response, next: NextFunction) {
	if (!req.cookies?.refresh) {
		return next(new BadRequestException("No refresh token provided"));
	}

	const refreshToken = req.cookies?.refresh;

	try {
		const decodedRefreshToken = decodeToken(refreshToken, "refresh");
		const user = await User.findById(decodedRefreshToken._id);

		if (!user) {
			return next(new InvalidRefreshToken());
		}

		req.user = user;
	} catch (e: any) {
		return next(new InvalidRefreshToken(e));
	}
	next();
}

// checks if the user possess the permission to execute a certain task by checking if the user´s current role is in the ROLES array
export function authRole(ROLES: Record<string, string>) {
	return async function (req: RequestExtended, _res: Response, next: NextFunction) {
		const user = req.user!;

		const userFound = await User.findById(user._id);
		const role = await Role.findOne({ _id: { $in: userFound!.role } });

		if (!ROLES[role!.name]) {
			return next(new ForbiddenException());
		}

		next();
	};
}
