import { NextFunction } from 'express';
import User from '../db/schemas/User.schema';
import IUser from '../db/interfaces/User/IUser.interface';
import InternalServerException from '../exceptions/InternalServerError';

export const SignUp = async (userInfo: IUser, next: NextFunction) => {
  try {
    const hashedPassword = await User.hashPassword(userInfo.password, 12);

    const newUser = await User.create({
      ...userInfo,
      password: hashedPassword,
    });

    return newUser;
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an error with the signIn service. ${e.messge}`,
      ),
    );
  }
};

export const SignIn = async (userInfo: IUser, next: NextFunction) => {
  try {
    const userFound = await User.findOne({ email: userInfo.email });

    return userFound;
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an error with the signUp service. ${e.message}`,
      ),
    );
  }
};
