import { Request, Response, NextFunction } from 'express';
import Job from '../db/schemas/Job.schema';
import User from '../db/schemas/User.schema';
import IJob from '../db/schemas/interfaces/IJob.interface';
import BadRequestException from '../exceptions/BadRequestException';
import InternalServerException from '../exceptions/InternalServerError';
import NotFoundException from '../exceptions/NotFoundException';
import RequestExtended from '../interfaces/RequestExtended.interface';

// checks if there is already a job created with the provided name before creation
export async function validateJobExists(
  req: RequestExtended,
  _res: Response,
  next: NextFunction,
) {
  const { title, designated }: IJob = req.body;

  try {
    const jobExists = await Job.findOne({ title });

    if (jobExists) {
      return next(
        new BadRequestException(
          `There is already a job registered with the name ${title}`,
        ),
      );
    }

    // checks if the designated users for job monitoring exists
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
    return next(
      new InternalServerException(
        `There was an unexpected error with the job verification. ${e.message}`,
      ),
    );
  }
}

export async function verifyJobDeleted(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { _id } = req.params;

  try {
    const jobDeleted = await Job.findById(_id);

    if (!jobDeleted) {
      return next(
        new NotFoundException(
          `Job with id ${_id} not found. Probably it has already been deleted or has not been created yet.`,
        ),
      );
    }

    next();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the job deletion request. ${e.message}`,
      ),
    );
  }
}
