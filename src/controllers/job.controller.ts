/* eslint-disable no-underscore-dangle */
import { NextFunction, Response } from 'express';
import CreateJob from '../services/Job.service';
import IJob from '../db/interfaces/IJob.interface';
import InternalServerException from '../exceptions/InternalServerError';
import RequestWithUser from '../interfaces/RequestWithUser.interface';

const createJob = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const { title, designated }: IJob = req.body;

  try {
    const newJob = await CreateJob({ title, designated }, next, req);

    if (!newJob) {
      return next(
        new InternalServerException(
          'There was an error creation the job. Please try again',
        ),
      );
    }

    return res.status(201).send(newJob);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the job creation controller. ${e.message}`,
      ),
    );
  }
};

export default createJob;
