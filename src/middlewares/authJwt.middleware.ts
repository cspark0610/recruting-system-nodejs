/* eslint-disable func-names */
/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
import { Response, NextFunction } from 'express';
import { decodeToken } from '../lib/jwt';
import User from '../db/schemas/User.schema';
import Role from '../db/schemas/Role.schema';
import InvalidAccessToken from '../exceptions/InvalidAccessToken';
import AcessTokenMissingException from '../exceptions/AcessTokenMissingException';
import RequestExtended from '../interfaces/RequestExtended.interface';
import ForbiddenException from '../exceptions/ForbiddenException';

// checks if a JWT is valid
export async function verifyJwt(
  req: RequestExtended,
  _res: Response,
  next: NextFunction,
) {
  const accessToken = req.headers.authorization?.split(' ').pop();

  if (!accessToken || accessToken === 'Bearer') {
    return next(new AcessTokenMissingException());
  }

  try {
    const decoded = decodeToken(accessToken);

    const userFound = await User.findById(decoded._id, { password: 0 });

    if (!userFound) {
      return next(new InvalidAccessToken());
    }

    req.user = userFound;
  } catch (e: any) {
    return next(new InvalidAccessToken(e));
  }

  next();
}

// checks if the user possess the permission to execute a certain task by checking if the user´s current role is in the ROLES array
export function authRole(ROLES: Record<string, string>) {
  return async function (
    req: RequestExtended,
    _res: Response,
    next: NextFunction,
  ) {
    const user = await User.findById(req.user?._id);
    const role = await Role.findOne({ _id: { $in: user?.role } });

    if (!ROLES[role!.name]) {
      return next(new ForbiddenException());
    }

    next();
  };
}
