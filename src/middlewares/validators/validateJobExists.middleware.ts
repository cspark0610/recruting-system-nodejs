import { Request, Response, NextFunction } from 'express';
import Job from '../../db/schemas/Job.schema';
import IJob from '../../db/interfaces/IJob.interface';

export default async function validateJobExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { title }: IJob = req.body;

  try {
    const jobExists = await Job.findOne({ title });

    if (jobExists) {
      return res.status(400).send({
        message: `There is already an application with the name ${title}`,
      });
    }

    next();
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
}
