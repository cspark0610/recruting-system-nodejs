/* eslint-disable no-underscore-dangle */
import { NextFunction } from 'express';
import { Types } from 'mongoose';
import { IUser } from '../db/schemas/interfaces/User';
import User from '../db/schemas/User.schema';
import Role from '../db/schemas/Role.schema';
import InternalServerException from '../exceptions/InternalServerError';
import BadRequestException from '../exceptions/BadRequestException';

export const GetAllUsers = async (next: NextFunction) => {
  try {
    return await User.find({}, { password: 0 });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the GetAllUsers service. ${e.message}`,
      ),
    );
  }
};

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

    const newUserInfo = await User.findOne(
      { email: newUser.email },
      { password: 0 },
    );

    return newUserInfo;
  } catch (e: any) {
    next(
      new InternalServerException(
        `There was an error with the signUp service. ${e.messge}`,
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
        `There was an error with the signIn service. ${e.message}`,
      ),
    );
  }
};

export const GetUserWithoutPassword = async (
  email: string,
  next: NextFunction,
) => {
  try {
    return await User.findOne({ email }, { password: 0 });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error while retrieving the user without password. ${e.message}`,
      ),
    );
  }
};

export const ChangeRole = async (
  _id: string,
  newRole: Types.ObjectId,
  next: NextFunction,
) => {
  try {
    await User.findByIdAndUpdate(_id, { role: newRole });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error in the change role service. ${e.message}`,
      ),
    );
  }
};
