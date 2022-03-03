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

    if (!user) {
      return res.status(404).send({
        status: 'failure',
        code: 404,
        message: `User not found with id ${userId}`,
      });
    }

    if (user.videos_question_list.length !== 3) {
      const recordedVideos = user.videos_question_list.length;

      return res.status(400).send({
        status: 'failure',
        code: 400,
        message: `User has been found, but has not recorded all their videos. Currently they have recorded ${recordedVideos} out of 3`,
      });
    }

    temp.video_data = user.videos_question_list;
    temp.cv = user.cv;

    next();
  } catch (e: any) {
    console.error(e);
  }
}
