/* eslint-disable func-names */
/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import User from '../db/schemas/User.schema';
import Role from '../db/schemas/Role.schema';
import InvalidAccessToken from '../exceptions/InvalidAccessToken';
import AuthenticationTokenMissingExeption from '../exceptions/AuthenticationTokenMissingExeption';
import RequestExtended from '../interfaces/RequestExtended.interface';
import ForbiddenException from '../exceptions/ForbiddenException';
import { decodeToken } from '../lib/jwt';

dotenv.config();

export async function verifyJwt(
  req: RequestExtended,
  _res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(' ').pop();

  if (!token || token === 'Bearer') {
    return next(
      new AuthenticationTokenMissingExeption('No access token provided'),
    );
  }

  try {
    const decoded = decodeToken(token);

    const userFound = await User.findById(decoded._id, { password: '' });

    if (!userFound) {
      return next(new InvalidAccessToken('Invalid access token'));
    }

    req.user = userFound;
  } catch (e: any) {
    return next(new InvalidAccessToken(e));
  }

  next();
}

export function authRole(ROLES: Record<string, string>) {
  return async function (
    req: RequestExtended,
    _res: Response,
    next: NextFunction,
  ) {
    const user = await User.findById(req.user?._id);
    const role = await Role.findOne({ _id: { $in: user?.role } });

    if (!ROLES[role!.name]) {
      return next(
        new ForbiddenException(
          'You don´t have the necessary permissions to execute this action',
        ),
      );
    }

    next();
  };
}
