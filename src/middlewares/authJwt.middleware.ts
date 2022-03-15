/* eslint-disable func-names */
/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../db/schemas/User.schema';
import Role from '../db/schemas/Role.schema';
import InvalidAccessToken from '../exceptions/InvalidAccessToken';
import AuthenticationTokenMissingExeption from '../exceptions/AuthenticationTokenMissingExeption';
import DataStoredInToken from '../interfaces/DataStoredInToken.interface';
import RequestWithUser from '../interfaces/RequestWithUser.interface';
import ForbiddenException from '../exceptions/ForbiddenException';

dotenv.config();

const { JWT_SECRET } = process.env;

export async function verifyJwt(
  req: RequestWithUser,
  _res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(' ').pop();

  if (!token) {
    return next(
      new AuthenticationTokenMissingExeption('No access token provided'),
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET as string,
    ) as DataStoredInToken;

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
    req: RequestWithUser,
    _res: Response,
    next: NextFunction,
  ) {
    const user = await User.findById(req.user?._id);
    const roles = await Role.find({ _id: { $in: user?.role } });
    const rolesParsed = roles.map((role) => role.name);

    rolesParsed.forEach((role: string) => {
      if (!ROLES[role]) {
        return next(
          new ForbiddenException(
            'You don´t have the necessary permissions to execute this action',
          ),
        );
      }
    });

    next();
  };
}
