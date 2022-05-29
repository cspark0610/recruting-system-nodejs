/* eslint-disable no-underscore-dangle */
import { NextFunction } from 'express';
import { Types } from 'mongoose';
import { IUser } from '../db/schemas/interfaces/User';
import { createToken, verifyGoogleToken } from '../lib/jwt';
import { UpdateUserInfoDto } from '../db/schemas/dtos/User';
import { envConfig } from '../config';
import {
  InternalServerException,
  InvalidCredentialsException,
  BadRequestException,
} from '../exceptions';
import User from '../db/schemas/User.schema';
import Role from '../db/schemas/Role.schema';

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

    const refreshToken = createToken(newUser, JWT_REFRESH_TOKEN_EXP, 'refresh');

    newUser.refresh_token = refreshToken;
    newUser.save();

    const userWithouthPassword = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      position_name: newUser.position_name,
      phone: newUser.phone,
      role: newUser.role,
    };

    const accessToken = createToken(newUser, JWT_ACCESS_TOKEN_EXP, 'access');

    return { accessToken, refreshToken, userWithouthPassword };
  } catch (e: any) {
    next(
      new InternalServerException(
        `There was an error with the signUp service. ${e.messge}`,
      ),
    );
  }
};

export const SignUpGoogle = async (tokenId: string, next: NextFunction) => {
  try {
    const userPayload = await verifyGoogleToken(tokenId);

    const emailAt = userPayload?.email?.split('@').pop();

    if (emailAt !== 'fulltimeforce.com') {
      return next(
        new BadRequestException(
          `The email ${userPayload?.email} is not from FullTimeForce`,
        ),
      );
    }

    const userExists = await User.findOne({ email: userPayload?.email });

    if (userExists) {
      const accessToken = createToken(
        userExists,
        JWT_ACCESS_TOKEN_EXP,
        'access',
      );

      const refreshToken = createToken(
        userExists,
        JWT_REFRESH_TOKEN_EXP,
        'refresh',
      );

      const userWithouthPassword = {
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        picture: userExists.picture,
      };

      return { accessToken, refreshToken, userWithouthPassword };
    }

    const newUser = await User.create({
      name: userPayload?.name,
      email: userPayload?.email,
      password: 'hsdjakfhasf',
      picture: userPayload?.picture,
    });

    const userWithouthPassword = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      picture: newUser.picture,
    };

    const accessToken = createToken(newUser, JWT_ACCESS_TOKEN_EXP, 'access');
    const refreshToken = createToken(newUser, JWT_REFRESH_TOKEN_EXP, 'refresh');

    return { accessToken, refreshToken, userWithouthPassword };
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an error with the signUpGoogle service. ${e.message}`,
      ),
    );
  }
};

export const SignIn = async (
  userInfo: { email: string; password: string },
  next: NextFunction,
) => {
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
      position_name: userFound.position_name,
      phone: userFound.phone,
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

export const UpdateInfo = async (
  _id: string,
  newInfo: UpdateUserInfoDto,
  next: NextFunction,
) => {
  try {
    await User.findByIdAndUpdate(_id, newInfo);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an error in the update user info service. ${e.message}`,
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

export const ResetPassword = async (
  _id: string,
  new_password: string,
  next: NextFunction,
) => {
  try {
    const hashedPassword = await User.hashPassword(new_password, 12);
    await User.findByIdAndUpdate(_id, { password: hashedPassword });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error in the reset password service. ${e.message}`,
      ),
    );
  }
};
