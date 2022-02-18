import { Request, Response, NextFunction } from 'express';
import User from '../db/schemas/User.schema';
import IUser from '../interfaces/IUser.interface';
import temp from '../lib/tempVariables';

export default async function validateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params;

    const user: IUser | null = await User.findOne({ id: userId });

    if (!user || Object.entries(user).length === 0) {
      return res.status(404).send({
        status: 'failure',
        code: 404,
        message: `User not found with id ${userId}`,
      });
    }

    if (!user.video_key) {
      return res.status(400).send({
        status: 'failure',
        code: 400,
        message: 'User has been found, but has yet to record their video',
      });
    }

    temp.video_key = user.video_key;

    next();
  } catch (e: any) {
    console.error(e);
  }
}
