import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import IUser from '../db/interfaces/User/IUser.interface';
import * as userService from '../services/User.service';
import ForbiddenException from '../exceptions/ForbiddenException';
import InternalServerException from '../exceptions/InternalServerError';

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userInfo: IUser = req.body;

  try {
    const userFound = await userService.SignIn(userInfo);

    if (!userFound) {
      return next(new ForbiddenException('Invalid email or password'));
    }

    if (!bcrypt.compare(userInfo.password, userFound.password)) {
      return next(new ForbiddenException('Invalid email or password'));
    }
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error. ${e.message}`,
      ),
    );
  }
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userInfo: IUser = req.body;
    const user = await userService.SignUp(userInfo);

    return res.status(201).send(user);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error. ${e.message}`,
      ),
    );
  }
};
