/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { IUser } from '../db/schemas/interfaces/User';
import { createToken } from '../lib/jwt';
import envConfig from '../config/env';
import InternalServerException from '../exceptions/InternalServerError';
import RequestExtended from '../interfaces/RequestExtended.interface';
import * as userService from '../services/User.service';

const { JWT_ACCESS_TOKEN_EXP, JWT_REFRESH_TOKEN_EXP } = envConfig;

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
    const data = await userService.SignIn(userInfo, next);

    return res.status(200).send({
      status: 200,
      access_token: data!.accessToken.token,
      refresh_token: data!.refreshToken.token,
      user: data!.userWithouthPassword,
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
    const data = await userService.SignUp(userInfo, next);

    return res.status(201).send({
      status: 201,
      access_token: data!.accessToken.token,
      refresh_token: data!.refreshToken.token,
      user: data!.userWithouthPassword,
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

    const accessToken = createToken(user!, JWT_ACCESS_TOKEN_EXP, 'access');
    const refreshToken = createToken(user!, JWT_REFRESH_TOKEN_EXP, 'refresh');

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
