/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
import { Request, Response, NextFunction } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
import { decodeToken } from '../lib/jwt';
import {
  UpdateStatusDto,
  UpdateCandidateInfoDto,
} from '../db/schemas/dtos/Candidate';
import envConfig from '../config/env';
import ICandidate from '../db/schemas/interfaces/ICandidate.interface';
import NotFoundException from '../exceptions/NotFoundException';
import BadRequestException from '../exceptions/BadRequestException';
import InternalServerException from '../exceptions/InternalServerError';
import RequestExtended from '../interfaces/RequestExtended.interface';
import checkIsEmptyObject from '../lib/checkIsEmptyObject';
import { ResponseData } from '../lib/checkIsEmptyObject';
import * as candidateService from '../services/Candidate.Service';

const unlinkFile = promisify(unlink);

const { NODE_ENV, REDIRECT_URL_DEVELOPMENT, REDIRECT_URL_PRODUCTION } =
  envConfig;

export const getAllCandidates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = req.query.query as string;

    if (query) {
      const candidates = await candidateService.GetCandidateByQuery(
        query,
        next,
      );

      if (!candidates) {
        return next(
          new NotFoundException(
            'No candidates were found with the provided query',
          ),
        );
      }

      const isEmpty = checkIsEmptyObject(candidates);

      if (isEmpty) {
        return next(
          new NotFoundException(
            'No candidates were found with the provided query',
          ),
        );
      }

      return res.status(200).send({
        status: 200,
        candidatesFiltered: {
          interested: candidates.interestedCandidates,
          applying: candidates.applyingCandidates,
          meeting: candidates.meetingCandidates,
          chosen: candidates.chosenCandidates,
        },
      });
    }

    const allCandidates = await candidateService.GetAllCandidates(next);

    if (!allCandidates) {
      return next(new NotFoundException('No candidates were found'));
    }

    return res.status(200).send({
      status: 200,
      allCandidates: {
        interested: allCandidates.interestedCandidates,
        applying: allCandidates.applyingCandidates,
        meeting: allCandidates.meetingCandidates,
        chosen: allCandidates.chosenCandidates,
      },
    });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the getAllCandidates controller. ${e.message}`,
      ),
    );
  }
};

export const getCandidatesFiltered = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { position, secondary_status, query, apply_next, previousQuery } =
    req.body;

  try {
    if (apply_next && previousQuery) {
      const candidatesFiltered = await candidateService.ApplyNextFilter(
        previousQuery,
        position,
        secondary_status,
        query,
        next,
      );

      if (!candidatesFiltered) {
        return next(
          new NotFoundException(
            'No candidates were found with the provided filters',
          ),
        );
      }

      const isEmpty = checkIsEmptyObject(candidatesFiltered as ResponseData);

      return res.status(200).send({ status: 200, candidatesFiltered });
    }

    if (query) {
      const candidates = await candidateService.GetCandidateByQuery(
        query,
        next,
      );

      if (!candidates) {
        return next(
          new NotFoundException(
            'No candidates were found with the provided query',
          ),
        );
      }

      return res.status(200).send({
        status: 200,
        candidatesFiltered: {
          interested: candidates.interestedCandidates,
          applying: candidates.applyingCandidates,
          meeting: candidates.meetingCandidates,
          chosen: candidates.chosenCandidates,
        },
      });
    }

    const candidatesFiltered = await candidateService.GetCandidatesFiltered(
      next,
      position,
      secondary_status,
    );

    if (!candidatesFiltered) {
      return next(
        new NotFoundException(
          'No candidates were found with the provided filters',
        ),
      );
    }

    return res.status(200).send({
      status: 200,
      candidatesFiltered: {
        interested: candidatesFiltered.interestedCandidates,
        applying: candidatesFiltered.applyingCandidates,
        meeting: candidatesFiltered.meetingCandidates,
        chosen: candidatesFiltered.chosenCandidates,
      },
    });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the getCandidatesFiltered controller. ${e.message}`,
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

export const getCV = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { key } = req.params;

  try {
    const candidateCV = await candidateService.GetCV(key, next);

    if (!candidateCV) {
      return next(new NotFoundException(`CV file not found`));
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

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cv = req.file as Express.Multer.File;
  const { name, email, phone, job, english_level, country }: ICandidate =
    req.body;

  try {
    // uploads CV file to S3. Then the file is removed automatically from the server
    const result = await candidateService.UploadCV(cv, next);
    await unlinkFile(cv.path);

    const cvKey = result?.Key;

    const data = await candidateService.Create(
      {
        name,
        email,
        phone,
        country,
        english_level,
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

export const updateInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;
  const {
    academic_training,
    salary_expectations,
    available_from,
    skills,
    linkedin,
    portfolio,
    working_reason,
  }: UpdateCandidateInfoDto = req.body;

  const newCandidateInfo = {
    academic_training: academic_training,
    salary_expectations: salary_expectations,
    available_from,
    skills: skills,
    linkedin: linkedin,
    portfolio,
    working_reason,
  };

  try {
    await candidateService.UpdateInfo(_id, newCandidateInfo, next);

    return res
      .status(200)
      .send({ status: 200, message: 'Candidate updated successfully' });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an error with the candidate info update controller. ${e.message}`,
      ),
    );
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;
  const { main_status, secondary_status }: UpdateStatusDto = req.body;

  try {
    await candidateService.UpdateStatus(
      _id,
      { main_status, secondary_status },
      next,
    );

    return res
      .status(200)
      .send({ status: 200, message: 'Candidate status updated successfully' });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an error with the candidate status update controller. ${e.message}`,
      ),
    );
  }
};

export const updateConclusions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;
  const { conclusions } = req.body;

  try {
    await candidateService.UpdateConclusions(_id, conclusions, next);

    return res.status(200).send({
      status: 200,
      message: 'Candidate conclusions updated successfully',
    });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an error with the candidate conclusions update controller. ${e.message}`,
      ),
    );
  }
};

export const generateUniqueUrl = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { candidate } = req;
    const token = await candidateService.GenerateUrl(candidate!, next);

    if (!token) {
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
          ? `${REDIRECT_URL_DEVELOPMENT}/url/validate?token=${token.token}`
          : `${REDIRECT_URL_PRODUCTION}?token=${token.token}`,
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
      return next(new NotFoundException(`No video found`));
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

    // sets the video_key property in candidate schema after video is uploaded to S3
    await candidateService.SaveVideoKey(
      question_id,
      candidate_id,
      next,
      result!.Key,
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

export const validateUrl = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.query.token as string;

    const decoded = decodeToken(token, 'access');

    return res.status(200).send({
      status: 200,
      decoded: { _id: decoded._id, url_id: decoded.url_id },
    });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error returning the token. ${e.message}`,
      ),
    );
  }
};

export const setIsRejected = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { _id } = req.params;

    await candidateService.SetIsRejected(_id, next);

    return res.status(200).send({
      status: 200,
      message: 'Candidate status updated successfully',
    });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an error with the candidate status update controller. ${e.message}`,
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
    status: 200,
    message: 'Url deleted successfully',
  });
};
