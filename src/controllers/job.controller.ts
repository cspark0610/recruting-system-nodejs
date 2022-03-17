/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction } from 'express';
import IJob from '../db/schemas/interfaces/IJob.interface';
import InternalServerException from '../exceptions/InternalServerError';
import RequestExtended from '../interfaces/RequestExtended.interface';
import BadRequestException from '../exceptions/BadRequestException';
import * as jobService from '../services/Job.service';

export const createJob = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  const { title, designated, skills_required, video_questions_list }: IJob =
    req.body;

  try {
    const newJob = await jobService.CreateJob(
      { title, designated, skills_required, video_questions_list },
      next,
      req,
    );

    if (!newJob) {
      return next(
        new InternalServerException(
          'There was an error creation the job. Please try again',
        ),
      );
    }

    return res.status(201).send({ status: 201, newJob });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the job creation controller. ${e.message}`,
      ),
    );
  }
};

export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;

  if (!_id) {
    return next(new BadRequestException('No job id was provided'));
  }

  try {
    await jobService.DeleteJob(_id, next);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the job deletion controller. ${e.message}`,
      ),
    );
  }
  return res
    .status(200)
    .send({ status: 200, message: 'Job deleted successfully' });
};
