/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction } from 'express';
import IJob from '../db/schemas/interfaces/IJob.interface';
import InternalServerException from '../exceptions/InternalServerError';
import RequestExtended from '../interfaces/RequestExtended.interface';
import BadRequestException from '../exceptions/BadRequestException';
import * as jobService from '../services/Job.service';
import NotFoundException from '../exceptions/NotFoundException';

export const getAllJobs = async (
  _req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jobs = await jobService.GetAllJobs(next);

    if (!jobs) {
      return next(new NotFoundException('No jobs found'));
    }

    res.status(200).send({ status: 200, jobs });
  } catch (e: any) {
    next(new InternalServerException(e));
  }
};

export const create = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  const {
    title,
    designated,
    client_name,
    rie_link,
    recruiter_filter,
    skills_required,
    video_questions_list,
  }: IJob = req.body;

  try {
    const newJob = await jobService.Create(
      {
        title,
        designated,
        client_name,
        rie_link,
        recruiter_filter,
        skills_required,
        video_questions_list,
      },
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

export const updateInfo = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;
  const {
    title,
    designated,
    client_name,
    rie_link,
    recruiter_filter,
    skills_required,
    video_questions_list,
  }: IJob = req.body;

  try {
    await jobService.UpdateInfo(
      _id,
      {
        title,
        designated,
        client_name,
        rie_link,
        recruiter_filter,
        skills_required,
        video_questions_list,
      },
      next,
    );

    return res
      .status(200)
      .send({ status: 200, message: 'Job updated successfully' });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the job update controller. ${e.message}`,
      ),
    );
  }
};

export const setIsActive = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;

  try {
    await jobService.SetIsActive(_id, next);

    return res
      .status(200)
      .send({ status: 200, message: 'Job status updated successfully' });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the job status update controller. ${e.message}`,
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
    await jobService.Delete(_id, next);
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
