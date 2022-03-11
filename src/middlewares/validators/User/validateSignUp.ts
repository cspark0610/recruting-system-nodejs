import { Request, Response, NextFunction } from 'express';
import User from '../../../db/schemas/User.schema';
import IUser from '../../../db/interfaces/User/IUser.interface';

export default async function validateSignUp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, email, password }: IUser = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Some fields are missing');
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .send(`There is already a user with the email ${email}`);
    }

    next();
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
}
