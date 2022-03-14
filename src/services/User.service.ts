/* eslint-disable no-underscore-dangle */
import { NextFunction } from 'express';
import User from '../db/schemas/User.schema';
import Role from '../db/schemas/Role.schema';
import IUser from '../db/interfaces/User/IUser.interface';
import InternalServerException from '../exceptions/InternalServerError';
import BadRequestException from '../exceptions/BadRequestException';

export const SignUp = async (userInfo: IUser, next: NextFunction) => {
  try {
    const hashedPassword = await User.hashPassword(userInfo.password, 12);
    let foundRoles;

    if (userInfo.role) {
      foundRoles = await Role.find({ name: { $in: userInfo.role } });

      if (foundRoles.length === 0) {
        return next(
          new BadRequestException(
            `Role(s) ${userInfo.role} not found in database`,
          ),
        );
      }
    } else {
      foundRoles = await Role.find({ name: 'COMMON' });
    }

    const newUser = await User.create({
      ...userInfo,
      password: hashedPassword,
      role: foundRoles?.map((role) => role._id),
    });

    return newUser;
  } catch (e: any) {
    next(
      new InternalServerException(
        `There was an error with the signIn service. ${e.messge}`,
      ),
    );
  }
};

export const SignIn = async (email: string, next: NextFunction) => {
  try {
    const userFound = await User.findOne({ email });

    return userFound;
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an error with the signUp service. ${e.message}`,
      ),
    );
  }
};
