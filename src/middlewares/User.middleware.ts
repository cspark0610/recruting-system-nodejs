/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction } from "express";
import { IUser } from "../db/schemas/interfaces/User";
import { BadRequestException, InternalServerException } from "../exceptions";
import { RequestExtended } from "../interfaces";
import User from "../db/schemas/User.schema";
import Role from "../db/schemas/Role.schema";

export async function validateSignUp(req: Request, _res: Response, next: NextFunction) {
	const { email }: IUser = req.body;

	try {
		// const emailAt = email.split('@').pop();

		// if (emailAt !== 'fulltimeforce.com') {
		//   return next(new BadRequestException('The email is invalid'));
		// }

		const userExists = await User.findOne({ email });

		if (userExists) {
			next(new BadRequestException(`There is already an user registered with the email ${email}`));
		}

		next();
	} catch (e: any) {
		return next(
			new InternalServerException(`There was an unexpected error validating the user. ${e.message}`)
		);
	}
}

// checks that the new role the ADMIN wants to set for an user is valid and that the user does not have the new role already assigned
export async function validateNewRole(req: RequestExtended, _res: Response, next: NextFunction) {
	const { _id } = req.params;
	const { newRole } = req.body;

	try {
		const user = await User.findById(_id);

		if (!user) {
			return next(new BadRequestException("Invalid user id"));
		}

		const roleExists = await Role.findOne({ name: newRole });

		if (!roleExists) {
			return next(new BadRequestException("Invalid role"));
		}

		const rolesMatch = user.role?._id.equals(roleExists._id);

		if (rolesMatch) {
			return next(
				new BadRequestException(`The user ${user.name} already has the role '${newRole}' assigned`)
			);
		}

		req.role = roleExists._id;

		next();
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the new role validation. ${e.message}`
			)
		);
	}
}

export async function validateNewPassword(
	req: RequestExtended,
	_res: Response,
	next: NextFunction
) {
	const { _id } = req.params;
	const { new_password, old_password } = req.body;

	try {
		const user = await User.findById(_id);

		if (!user) {
			return next(new BadRequestException("Invalid user id"));
		}

		if (new_password === old_password) {
			return next(new BadRequestException("The new password must be different from the old one"));
		}

		next();
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the new password validation. ${e.message}`
			)
		);
	}
}
