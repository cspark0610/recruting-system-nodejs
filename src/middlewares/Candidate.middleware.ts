/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
import dotenv from 'dotenv';
import Candidate from '../db/schemas/Candidate.schema';
import ICandidate from '../db/schemas/interfaces/ICandidate.interface';
import Job from '../db/schemas/Job.schema';
import InternalServerException from '../exceptions/InternalServerError';
import BadRequestException from '../exceptions/BadRequestException';
import RequestExtended from '../interfaces/RequestExtended.interface';
import NotFoundException from '../exceptions/NotFoundException';
import InvalidAccessToken from '../exceptions/InvalidAccessToken';
import VideoRecordingUrlSchema from '../db/schemas/VideoRecordingUrl.schema';
import { decodeToken } from '../lib/jwt';

dotenv.config();

export async function verifyCandidateExistsBeforeSignUp(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { email, job }: ICandidate = req.body;

  try {
    const candidateExists = await Candidate.findOne({ email });

    if (candidateExists) {
      return next(
        new BadRequestException(
          `There is already a candidate registered with the email ${email}`,
        ),
      );
    }

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

  const unlinkFile = promisify(unlink);

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
    const decoded = decodeToken(token);

    const candidate = await Candidate.findById(decoded._id);
    const url = await VideoRecordingUrlSchema.findOne({
      short_url: decoded.url_id,
    });

    if (!candidate || !url) {
      return next(new InvalidAccessToken('Invalid access token'));
    }

    next();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate url jwt validation. ${e.message}`,
      ),
    );
  }
}

export async function verifyCandidateVideoEmptyBeforeUpload(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { candidate_id } = req.params;
  const { question_id } = req.body;

  try {
    const candidate = await Candidate.findById(candidate_id);

    if (!candidate) {
      return next(
        new NotFoundException(`NO candidate foun with id ${candidate_id}`),
      );
    }

    if (!candidate.videos_question_list) {
      return next(new InternalServerException('Error'));
    }

    if (candidate.videos_question_list[question_id - 1].video_key) {
      return next(
        new BadRequestException(
          `Candidate has already uploaded their video for question ${question_id}`,
        ),
      );
    }

    next();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error whilte verifying the candididate video.${e.message}`,
      ),
    );
  }
}
