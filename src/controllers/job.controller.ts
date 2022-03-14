/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express';
import { CreateJob, SetCandidate } from '../services/Job.service';
import IJob from '../db/interfaces/IJob.interface';
import InternalServerException from '../exceptions/InternalServerError';

export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, designated }: IJob = req.body;

  try {
    const newJob = await CreateJob({ title, designated }, next);

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

export const setCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;
  const { candidateId } = req.body;

  try {
    const data = await SetCandidate(_id, candidateId, next);

    if (!data) {
      return next(
        new InternalServerException(
          'There was an error setting the job into the candidate. Please try again',
        ),
      );
    }

    return res.status(200).send(data);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate job setting controller. ${e.message}`,
      ),
    );
  }
};
