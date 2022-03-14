import { Response, NextFunction } from 'express';
import Job from '../../db/schemas/Job.schema';
import User from '../../db/schemas/User.schema';
import IJob from '../../db/interfaces/IJob.interface';
import BadRequestException from '../../exceptions/BadRequestException';
import RequestWithUser from '../../interfaces/RequestWithUser.interface';

export default async function validateJobExists(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  const { title, designated }: IJob = req.body;

  try {
    const jobExists = await Job.findOne({ title });

    if (jobExists) {
      return res.status(400).send({
        message: `There is already an application with the name ${title}`,
      });
    }

    const designatedUsers = await User.find({
      name: { $in: designated },
    });

    if (designatedUsers.length === 0) {
      return next(
        new BadRequestException(`User(s) ${designated} not found in database`),
      );
    }

    req.designated = designatedUsers;

    next();
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
}
