import { Request, Response, NextFunction } from 'express';
import IUser from '../../../db/interfaces/User/IUser.interface';

export default function validateSignIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, password }: IUser = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'No email or password provided' });
  }

  next();
}
