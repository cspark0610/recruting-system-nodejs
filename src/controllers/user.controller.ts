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

    return res.status(200).send({ status: 200, allUsers: users });
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
  const { email, password, tokenId } = req.body;

  try {
    if (tokenId) {
      const data = await userService.SignUpGoogle(tokenId, next);

      if (!data) {
        return next(
          new InternalServerException(
            'There was an error signing in. Please try again.',
          ),
        );
      }

      return res.status(200).send({
        status: 200,
        access_token: data.accessToken.token,
        refresh_token: data.refreshToken.token,
        user: data.userWithouthPassword,
      });
    }

    const data = await userService.SignIn({ email, password }, next);

    if (!data) {
      return next(
        new InternalServerException(
          'There was an error signing in. Please try again.',
        ),
      );
    }

    res.cookie('access', data.accessToken.token);
    res.cookie('refresh', data.refreshToken.token);

    return res.status(200).send({
      status: 200,
      user: data.userWithouthPassword,
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

    if (!data) {
      return next(
        new InternalServerException('There was an error signing up.'),
      );
    }

    res.cookie('access', data.accessToken.token);
    res.cookie('refresh', data.refreshToken.token);

    return res.status(201).send({
      status: 201,
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

export const updateInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const newInfo: IUser = req.body;
  const { _id } = req.params;

  try {
    await userService.UpdateInfo(_id, newInfo, next);

    return res.status(200).send({
      status: 200,
      message: 'User updated successfully',
    });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the update user info controller. ${e.message}`,
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

    return res.status(200).send({ accessToken, refreshToken });
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

  await userService.ChangeRole(_id, req.role!, next);

  return res
    .status(200)
    .send({ status: 200, message: 'User role updated successfully' });
};

export const resetPassword = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;
  const { new_password } = req.body;

  await userService.ResetPassword(_id, new_password, next);

  return res
    .status(200)
    .send({ status: 200, message: 'Password updated successfully' });
};
