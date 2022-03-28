/* eslint-disable no-underscore-dangle */
import { NextFunction } from 'express';
import { Types } from 'mongoose';
import { IUser } from '../db/schemas/interfaces/User';
import { createToken } from '../lib/jwt';
import envConfig from '../config/env';
import User from '../db/schemas/User.schema';
import Role from '../db/schemas/Role.schema';
import InternalServerException from '../exceptions/InternalServerError';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import BadRequestException from '../exceptions/BadRequestException';

const { JWT_ACCESS_TOKEN_EXP, JWT_REFRESH_TOKEN_EXP } = envConfig;

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

    // checks if the role that will be set to the user indeed exists
    if (userInfo.role) {
      foundRoles = await Role.find({ name: { $in: userInfo.role } });

      if (foundRoles.length === 0) {
        return next(
          new BadRequestException(
            `The Role(s) ${userInfo.role} does not exist`,
          ),
        );
      }
    } else {
      // if a role is not especified, the role COMMON is set by default
      foundRoles = await Role.find({ name: 'COMMON' });
    }

    const newUser = await User.create({
      ...userInfo,
      password: hashedPassword,
      role: foundRoles?.map((role) => role._id),
    });

    const userWithouthPassword = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    const accessToken = createToken(newUser, JWT_ACCESS_TOKEN_EXP, 'access');
    const refreshToken = createToken(newUser, JWT_REFRESH_TOKEN_EXP, 'refresh');

    return { accessToken, refreshToken, userWithouthPassword };
  } catch (e: any) {
    next(
      new InternalServerException(
        `There was an error with the signUp service. ${e.messge}`,
      ),
    );
  }
};

export const SignIn = async (userInfo: IUser, next: NextFunction) => {
  try {
    const userFound = await User.findOne({ email: userInfo.email });

    if (!userFound) {
      return next(new InvalidCredentialsException());
    }

    const passwordsMatch = await User.comparePassword(
      userInfo.password,
      userFound.password,
    );

    if (!passwordsMatch) {
      return next(new InvalidCredentialsException());
    }

    const userWithouthPassword = {
      _id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      role: userFound.role,
    };

    const accessToken = createToken(userFound, JWT_ACCESS_TOKEN_EXP, 'access');
    const refreshToken = createToken(
      userFound,
      JWT_REFRESH_TOKEN_EXP,
      'refresh',
    );

    return { userWithouthPassword, accessToken, refreshToken };
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an error with the signIn service. ${e.message}`,
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
