/* eslint-disable no-underscore-dangle */
import { NextFunction } from 'express';
import dotenv from 'dotenv';
import Job from '../db/schemas/Job.schema';
import IJob from '../db/interfaces/IJob.interface';
import InternalServerException from '../exceptions/InternalServerError';
import RequestExtended from '../interfaces/RequestExtended.interface';

dotenv.config();

// eslint-disable-next-line operator-linebreak
const { NODE_ENV, REDIRECT_URL_DEVELOPMENT, REDIRECT_URL_PRODUCTION } =
  process.env;

export const CreateJob = async (
  jobInfo: IJob,
  next: NextFunction,
  req: RequestExtended,
) => {
  try {
    const newJob = await Job.create({
      ...jobInfo,
      designated: req?.designated?.map((user) => user._id),
    });

    const newJobWithUrl = await Job.findByIdAndUpdate(
      newJob._id,
      {
        url:
          NODE_ENV === 'development'
            ? `${REDIRECT_URL_DEVELOPMENT}/info-upload?job_id=${newJob._id}`
            : `${REDIRECT_URL_PRODUCTION}/info-upload?job_id=${newJob._id}`,
      },
      { new: true },
    );

    return newJobWithUrl;
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the job creation service. ${e.message}`,
      ),
    );
  }
};

export const DeleteJob = async (_id: string, next: NextFunction) => {
  try {
    await Job.findOneAndRemove({ _id });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the job deletion service. ${e.message}`,
      ),
    );
  }
};
