/* eslint-disable no-underscore-dangle */
import { NextFunction } from "express";
import { Types } from "mongoose";
import { IUser } from "../db/schemas/interfaces/User";
import { createToken, verifyGoogleToken } from "../lib/jwt";
import { UpdateUserInfoDto } from "../db/schemas/dtos/User";
import { envConfig } from "../config";
import {
	InternalServerException,
	InvalidCredentialsException,
	BadRequestException,
} from "../exceptions";
import User from "../db/schemas/User.schema";
import Role from "../db/schemas/Role.schema";
import { TokenPayload } from "google-auth-library";

const { JWT_ACCESS_TOKEN_EXP, JWT_REFRESH_TOKEN_EXP } = envConfig;

export const GetAllUsers = async (next: NextFunction) => {
	try {
		return await User.find({}, { password: 0 });
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the GetAllUsers service. ${e.message}`
			)
		);
	}
};

export const SignUp = async (userInfo: IUser, next: NextFunction) => {
	try {
		const hashedPassword = await User.hashPassword(userInfo.password, 12);
		let foundRoles: any[];

		// checks if the role that will be set to the user indeed exists
		if (userInfo.role) {
			foundRoles = await Role.find({ name: { $in: userInfo.role } });

			if (foundRoles.length === 0) {
				return next(new BadRequestException(`The Role(s) ${userInfo.role} does not exist`));
			}
		} else {
			// if a role is not especified, the role COMMON is set by default
			foundRoles = await Role.find({ name: "COMMON" });
		}

		const newUser = await User.create({
			...userInfo,
			password: hashedPassword,
			role: foundRoles?.map((role) => role._id),
			google_sign_in: false,
		});

		const refreshToken = createToken(newUser, JWT_REFRESH_TOKEN_EXP, "refresh");

		const userWithouthPassword = {
			_id: newUser._id,
			name: newUser.name,
			email: newUser.email,
			country: newUser.country,
			position_name: newUser.position_name,
			google_sign_in: newUser.google_sign_in,
			phone: newUser.phone,
			role: newUser.role,
		};

		const accessToken = createToken(newUser, JWT_ACCESS_TOKEN_EXP, "access");

		return { accessToken, refreshToken, userWithouthPassword };
	} catch (e: any) {
		next(new InternalServerException(`There was an error with the signUp service. ${e.messge}`));
	}
};

export const SignUpGoogle = async (tokenId: string, next: NextFunction) => {
	try {
		const userPayload: TokenPayload = await verifyGoogleToken(tokenId);

		// const emailAt = userPayload?.email?.split('@').pop();
		// if (emailAt !== 'fulltimeforce.com') {
		//   return next(
		//     new BadRequestException(
		//       `The email ${userPayload?.email} is not from FullTimeForce`,
		//     ),
		//   );
		// }

		const userExists = await User.findOne({ email: userPayload?.email });

		if (userExists) {
			const accessToken = createToken(userExists, JWT_ACCESS_TOKEN_EXP, "access");
			const refreshToken = createToken(userExists, JWT_REFRESH_TOKEN_EXP, "refresh");

			const userWithouthPassword = {
				_id: userExists._id,
				name: userExists.name,
				email: userExists.email,
				picture: userExists?.picture,
				position_name: userExists.position_name,
				country: userExists.country,
				phone: userExists.phone,
				role: userExists.role,
				working_since: userExists.working_since,
				google_sign_in: !userExists.google_sign_in ? true : userExists.google_sign_in,
				google_id: userPayload.sub,
			};

			return { accessToken, refreshToken, userWithouthPassword };
		}

		const defaultPassword = "12345678";
		const role = await Role.create({ name: "COMMON" });
		const newUser = await User.create({
			name: userPayload?.name,
			email: userPayload?.email,
			password: await User.hashPassword(defaultPassword, 12),
			google_sign_in: true,
			google_id: userPayload.sub,
			role,
			picture: userPayload?.picture,
		});

		const userWithouthPassword = {
			_id: newUser._id,
			name: newUser.name,
			email: newUser.email,
			picture: newUser.picture,
			position_name: newUser.position_name,
			country: newUser.country,
			phone: newUser.phone,
			role: newUser.role,
			working_since: newUser.working_since,
			google_sign_in: newUser.google_sign_in ? true : false,
		};

		const accessToken = createToken(newUser, JWT_ACCESS_TOKEN_EXP, "access");
		const refreshToken = createToken(newUser, JWT_REFRESH_TOKEN_EXP, "refresh");

		return { accessToken, refreshToken, userWithouthPassword };
	} catch (e: any) {
		return next(
			new InternalServerException(`There was an error with the signUpGoogle service. ${e.message}`)
		);
	}
};

export const SignIn = async (userInfo: { email: string; password: string }, next: NextFunction) => {
	try {
		const userFound = await User.findOne({ email: userInfo.email });

		if (!userFound) {
			return next(new InvalidCredentialsException());
		}

		const passwordsMatch = await User.comparePassword(userInfo.password, userFound.password);

		if (!passwordsMatch) {
			return next(new InvalidCredentialsException());
		}

		const userWithouthPassword = {
			_id: userFound._id,
			name: userFound.name,
			email: userFound.email,
			position_name: userFound.position_name,
			phone: userFound.phone,
			google_sign_in: userFound.google_sign_in ? true : false,
			country: userFound.country,
			role: userFound.role,
			working_since: userFound.working_since,
		};

		const accessToken = createToken(userFound, JWT_ACCESS_TOKEN_EXP, "access");
		const refreshToken = createToken(userFound, JWT_REFRESH_TOKEN_EXP, "refresh");

		return { userWithouthPassword, accessToken, refreshToken };
	} catch (e: any) {
		return next(
			new InternalServerException(`There was an error with the signIn service. ${e.message}`)
		);
	}
};

export const UpdateInfo = async (_id: string, newInfo: UpdateUserInfoDto, next: NextFunction) => {
	try {
		await User.findByIdAndUpdate(_id, newInfo);

		const updatedUser = await User.findById(_id);

		const userWithouthPassword = {
			_id: updatedUser!._id,
			name: updatedUser!.name,
			email: updatedUser!.email,
			picture: updatedUser!.picture,
			country: updatedUser!.country,
			position_name: updatedUser!.position_name,
			phone: updatedUser!.phone,
			role: updatedUser!.role,
			working_since: updatedUser!.working_since,
			google_sign_in: updatedUser!.google_sign_in,
		};

		return userWithouthPassword;
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an error in the update user info service. ${e.message}`
			)
		);
	}
};

export const ChangeRole = async (_id: string, newRole: Types.ObjectId, next: NextFunction) => {
	try {
		await User.findByIdAndUpdate(_id, { role: newRole });
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error in the change role service. ${e.message}`
			)
		);
	}
};

export const ResetPassword = async (_id: string, new_password: string, next: NextFunction) => {
	try {
		const hashedPassword = await User.hashPassword(new_password, 12);
		await User.findByIdAndUpdate(_id, { password: hashedPassword });
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error in the reset password service. ${e.message}`
			)
		);
	}
};

export const DeleteUser = async (_id: string, next: NextFunction) => {
	try {
		await User.findByIdAndRemove(_id);
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error in the delete user service. ${e.message}`
			)
		);
	}
};
