/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import IUser from '../db/interfaces/User/IUser.interface';
import InternalServerException from '../exceptions/InternalServerError';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import createToken from '../lib/createToken';
import * as userService from '../services/User.service';

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userInfo: IUser = req.body;

  try {
    const userFound = await userService.SignIn(userInfo.email, next);

    if (!userFound) {
      return next(new InvalidCredentialsException('Invalid email or password'));
    }

    const passwordMatch = await bcrypt.compare(
      userInfo.password,
      userFound.password,
    );

    if (!passwordMatch) {
      return next(new InvalidCredentialsException('Invalid email or password'));
    }

    const token = createToken(userFound);

    return res.status(200).send(token);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the signIn controller. ${e.message}`,
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
    const user = await userService.SignUp(userInfo, next);

    if (!user) {
      return next(
        new InternalServerException(
          'There was an error creating a new user. Please try again',
        ),
      );
    }

    const token = createToken(user);

    return res.status(201).send(token);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the signUp controller. ${e.message}`,
      ),
    );
  }
};
