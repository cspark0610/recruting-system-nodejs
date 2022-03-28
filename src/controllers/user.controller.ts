/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { IUser } from '../db/schemas/interfaces/User';
import { createToken } from '../lib/jwt';
import InternalServerException from '../exceptions/InternalServerError';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import RequestExtended from '../interfaces/RequestExtended.interface';
import * as userService from '../services/User.service';

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userService.GetAllUsers(next);

    return res.status(200).send({ status: 200, users });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the getAllUsers controller. ${e.message}`,
      ),
    );
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userInfo: IUser = req.body;

  try {
    const userFound = await userService.SignIn(userInfo.email, next);

    if (!userFound) {
      return next(new InvalidCredentialsException());
    }

    const passwordMatch = await bcrypt.compare(
      userInfo.password,
      userFound.password,
    );

    if (!passwordMatch) {
      return next(new InvalidCredentialsException());
    }

    const userWithoutPassword = {
      _id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      role: userFound.role,
    };

    const acessToken = createToken(userFound, '1d', 'access');
    const refreshToken = createToken(userFound, '7d', 'refresh');

    return res.status(200).send({
      status: 200,
      userWithoutPassword,
      access_token: acessToken.token,
      refresh_token: refreshToken.token,
    });
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

    const accessToken = createToken(user, '1d', 'access');
    const refreshToken = createToken(user, '7d', 'refresh');

    return res.status(201).send({
      status: 201,
      access_token: accessToken.token,
      refresh_token: refreshToken.token,
      user,
    });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the signUp controller. ${e.message}`,
      ),
    );
  }
};

export const refreshToken = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req;

    const accessToken = createToken(user!, '1h', 'access');
    const refreshToken = createToken(user!, '7d', 'refresh');

    return res.status(200).send({
      access_token: accessToken.token,
      refresh_token: refreshToken.token,
    });
  } catch (e: any) {
    return next(new InternalServerException(e));
  }
};

export const changeRole = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;
  const newRole = req.role?._id;

  await userService.ChangeRole(_id, newRole!, next);

  return res
    .status(200)
    .send({ status: 200, message: 'User role updated successfully' });
};
