/* eslint-disable no-underscore-dangle */
import { NextFunction } from 'express';
import envConfig from '../config/env';
import Job from '../db/schemas/Job.schema';
import IJob from '../db/schemas/interfaces/IJob.interface';
import InternalServerException from '../exceptions/InternalServerError';
import RequestExtended from '../interfaces/RequestExtended.interface';

// eslint-disable-next-line operator-linebreak
const { NODE_ENV, REDIRECT_URL_DEVELOPMENT, REDIRECT_URL_PRODUCTION } =
  envConfig;

export const GetAllJobs = async (next: NextFunction) => {
  try {
    return await Job.find();
  } catch (e: any) {
    next(
      new InternalServerException(
        `There was an unexpected error: ${e.message}`,
      ),
    );
  }
};

export const GetJobInfo = async (_id: string, next: NextFunction) => {
  try {
    return await Job.findById(_id, { title: 1, designated: 0 });
  } catch (e: any) {
    next(
      new InternalServerException(
        `There was an unexpected error with the GetJobInfo service: ${e.message}`,
      ),
    );
  }
};

export const Create = async (
  jobInfo: IJob,
  next: NextFunction,
  req: RequestExtended,
) => {
  try {
    const newJob = await Job.create({
      ...jobInfo,
      designated: req?.designated?.map((user) => user._id),
    });

    // creates the job application url once the job is created
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

export const UpdateInfo = async (
  _id: string,
  newInfo: IJob,
  next: NextFunction,
) => {
  try {
    await Job.findByIdAndUpdate(_id, newInfo);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the job update service. ${e.message}`,
      ),
    );
  }
};

export const SetIsActive = async (_id: string, next: NextFunction) => {
  try {
    const currentJobStatus = await Job.findById(_id);
    await Job.findByIdAndUpdate(_id, { isActive: !currentJobStatus!.isActive });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the job status update service. ${e.message}`,
      ),
    );
  }
};

export const Delete = async (_id: string, next: NextFunction) => {
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
