/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import IUser from '../db/interfaces/User/IUser.interface';
import * as userService from '../services/User.service';
import InternalServerException from '../exceptions/InternalServerError';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';

dotenv.config();

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

    if (!bcrypt.compare(userInfo.password, userFound.password)) {
      return next(new InvalidCredentialsException('Invalid email or password'));
    }
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

    user.password = '';

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);

    return res.status(201).send(token);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the signUp controller. ${e.message}`,
      ),
    );
  }
};
