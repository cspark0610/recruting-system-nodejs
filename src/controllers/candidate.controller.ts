/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
import { Request, Response, NextFunction } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
import dotenv from 'dotenv';
import ICandidate from '../db/interfaces/ICandidate.interface';
import NotFoundException from '../exceptions/NotFoundException';
import BadRequestException from '../exceptions/BadRequestException';
import InternalServerException from '../exceptions/InternalServerError';
import * as candidateService from '../services/Candidate.Service';

dotenv.config();

const unlinkFile = promisify(unlink);

const { NODE_ENV, REDIRECT_URL_DEVELOPMENT, REDIRECT_URL_PRODUCTION } =
  process.env;

export const getAllCandidates = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allCandidates = await candidateService.GetAllCandidates(next);

    if (!allCandidates || allCandidates.length === 0) {
      return next(new NotFoundException('No candidates were found'));
    }

    return res.status(200).send({ status: 200, allCandidates });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the getAllCandidates controller. ${e.message}`,
      ),
    );
  }
};

export const getOneCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;

  if (!_id) {
    return next(new BadRequestException('No candidate id was provided'));
  }

  try {
    const candidate = await candidateService.GetOneCandidate(_id, next);

    if (!candidate) {
      return next(
        new NotFoundException(`No candidate with id ${_id} was found`),
      );
    }

    return res.status(200).send({ status: 200, candidate });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the getOneCandidate controller. ${e.message}`,
      ),
    );
  }
};

export const createCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cv = req.file as Express.Multer.File;
  const { name, email, phone, job, country }: ICandidate = req.body;

  try {
    const result = await candidateService.UploadCV(cv, next);
    await unlinkFile(cv.path);

    const cvKey = result?.Key;

    const data = await candidateService.CreateCandidate(
      {
        name,
        email,
        phone,
        country,
        job,
        cv: cvKey,
      },
      next,
    );

    if (!data) {
      return next(
        new InternalServerException(
          'There was an error creating the candidate. Please try again',
        ),
      );
    }

    return res.status(201).send({ status: 201, data });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate creation controller. ${e.message}`,
      ),
    );
  }
};

export const generateUniqueUrl = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await candidateService.GenerateUrl(next);

    if (!data) {
      return next(
        new InternalServerException(
          'There was an error creating the url. Please try again',
        ),
      );
    }

    return res.status(201).send({
      status: 201,
      client_url:
        NODE_ENV === 'development'
          ? `${REDIRECT_URL_DEVELOPMENT}/url/validate?id=${data.short_url}`
          : `${REDIRECT_URL_PRODUCTION}/url/validate?id=${data.short_url}`,
    });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the url creation controller. ${e.message}`,
      ),
    );
  }
};

export const getVideoFromS3 = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { key } = req.params;

    const candidateVideo = candidateService.GetVideoFromS3(key, next);

    if (!candidateVideo) {
      return next(new NotFoundException(`No video found with key ${key}`));
    }

    candidateVideo.pipe(res);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the video download controller. ${e.message}`,
      ),
    );
  }
};

export const uploadVideoToS3 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newCandidateVideo = req.file;

    const { candidate_id } = req.params;
    const { question_id } = req.body;

    if (!newCandidateVideo) {
      return next(new BadRequestException('No video file was received'));
    }

    const result = await candidateService.UploadVideoToS3(
      newCandidateVideo,
      next,
    );

    await unlinkFile(newCandidateVideo.path);

    await candidateService.SaveVideoKeyToUser(
      question_id,
      candidate_id,
      next,
      result?.Key,
    );

    return res.status(201).send({
      status: 201,
      message: 'Video uploaded successfully',
    });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the video upload controller. ${e.message}`,
      ),
    );
  }
};

export const deleteUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { url_id } = req.params;

  await candidateService.DeleteUrl(url_id, next);

  return res.status(200).send({
    status: 201,
    message: 'Url deleted successfully',
  });
};

export const getCV = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { key } = req.params;

  try {
    const candidateCV = await candidateService.GetCV(key, next);

    if (!candidateCV) {
      return next(new NotFoundException(`CV file not found with key ${key}`));
    }

    candidateCV.pipe(res);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the cv download controller. ${e.message}`,
      ),
    );
  }
};
