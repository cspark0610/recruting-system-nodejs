/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
import { decodeToken } from '../lib/jwt';
import Candidate from '../db/schemas/Candidate.schema';
import ICandidate from '../db/schemas/interfaces/ICandidate.interface';
import Job from '../db/schemas/Job.schema';
import VideoRecordingUrlSchema from '../db/schemas/VideoRecordingUrl.schema';
import InternalServerException from '../exceptions/InternalServerError';
import BadRequestException from '../exceptions/BadRequestException';
import RequestExtended from '../interfaces/RequestExtended.interface';
import NotFoundException from '../exceptions/NotFoundException';
import InvalidAccessToken from '../exceptions/InvalidAccessToken';

const unlinkFile = promisify(unlink);

// checks that there is not another candidate with the same email before sign up
export async function verifyCandidateExistsBeforeSignUp(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { email, job }: ICandidate = req.body;
  const cv = req.file as Express.Multer.File;

  try {
    const candidateExists = await Candidate.findOne({ email });

    if (candidateExists) {
      await unlinkFile(cv.path);
      return next(
        new BadRequestException(
          `There is already a candidate registered with the email ${email}`,
        ),
      );
    }

    // checks that the job a candidate is applying for exists
    const jobExists = await Job.findById(job);

    if (!jobExists) {
      return next(
        new BadRequestException(`No job has been found with the id ${job}`),
      );
    }

    next();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate verification. ${e.message}. Please try again`,
      ),
    );
  }
}

export async function verifyCandidateExistsBeforeUrlGeneration(
  req: RequestExtended,
  _res: Response,
  next: NextFunction,
) {
  const { _id } = req.params;

  try {
    const candidate = await Candidate.findById(_id);

    if (!candidate) {
      return next(
        new NotFoundException(`No candidate found with the id ${_id}`),
      );
    }

    if (candidate.video_recording_url) {
      return next(
        new BadRequestException('Candidate already has an url created'),
      );
    }

    req.candidate = candidate;

    next();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error verifying the candidate. ${e.message}`,
      ),
    );
  }
}

export async function verifyCandidateVideoUrlExistsBeforeDeletion(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { url_id } = req.params;

  try {
    const url = await VideoRecordingUrlSchema.findOne({ short_url: url_id });

    if (!url) {
      return next(
        new NotFoundException(
          `Url with id ${url_id} not found. Probably it has already been deleted or has not been created yet`,
        ),
      );
    }

    next();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error while verifying the candidate video url. ${e.message}`,
      ),
    );
  }
}

export async function validateCV(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const cv = req.file;

  if (!cv) {
    return next(new BadRequestException('No cv was provided'));
  }

  if (cv.mimetype !== 'application/pdf') {
    await unlinkFile(cv.path);
    return next(new BadRequestException('Only pdf files are supported'));
  }

  next();
}

export async function validateCandidateJwt(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = req.query.token as string;

  try {
    const decoded = decodeToken(token, 'access');

    const candidate = await Candidate.findById(decoded._id);
    const url = await VideoRecordingUrlSchema.findOne({
      short_url: decoded.url_id,
    });

    if (!candidate || !url) {
      return next(new InvalidAccessToken());
    }

    next();
  } catch (e: any) {
    return next(new InvalidAccessToken(e.message));
  }
}
