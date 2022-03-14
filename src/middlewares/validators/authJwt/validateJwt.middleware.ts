import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import InvalidAccessToken from '../../../exceptions/InvalidAccessToken';
import AuthenticationTokenMissingExeption from '../../../exceptions/AuthenticationTokenMissingExeption';

dotenv.config();

const { JWT_SECRET } = process.env;

export default async function verifyJwt(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = req.header('x-access-token');

  if (!token) {
    return next(
      new AuthenticationTokenMissingExeption('No access token provided'),
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
  } catch (e: any) {
    return next(new InvalidAccessToken(e));
  }

  next();
}
