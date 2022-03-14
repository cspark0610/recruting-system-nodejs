import { Request, Response, NextFunction } from 'express';
import User from '../../db/schemas/User.schema';
import IUser from '../../db/interfaces/User/IUser.interface';
import BadRequestException from '../../exceptions/BadRequestException';
import InternalServerException from '../../exceptions/InternalServerError';

export default async function validateSignUp(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { email }: IUser = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      next(new BadRequestException(`User already in use with email ${email}`));
    }

    next();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error validating the user. ${e.message}`,
      ),
    );
  }
}
