import { Request, Response, NextFunction } from 'express';
import User from '../../../db/schemas/User.schema';
import IUser from '../../../db/interfaces/User/IUser.interface';
import BadRequestException from '../../../exceptions/BadRequestException';

export default async function validateSignUp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, email, password }: IUser = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      next(new BadRequestException(`User already in use with email ${email}`));
    }

    next();
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
}
