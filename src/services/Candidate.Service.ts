/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
import { NextFunction } from 'express';
import { createReadStream } from 'fs';
import { createToken } from '../lib/jwt';
import {
  UpdateCandidateInfoDto,
  UpdateStatusDto,
  UpdateConclusionsDto,
} from '../db/schemas/dtos/Candidate';
import envConfig from '../config/env';
import s3 from '../config/aws';
import File from '../interfaces/File.interface';
import UploadParams from '../interfaces/UploadParams.interface';
import Candidate from '../db/schemas/Candidate.schema';
import ICandidate from '../db/schemas/interfaces/ICandidate.interface';
import Job from '../db/schemas/Job.schema';
import VideoRecordingUrl from '../db/schemas/VideoRecordingUrl.schema';
import InternalServerException from '../exceptions/InternalServerError';
import TokenData from '../interfaces/TokenData.interface';

const { AWS_VIDEO_BUCKET_NAME, AWS_CV_BUCKET_NAME, JWT_ACCESS_TOKEN_EXP } =
  envConfig;

export const GetAllCandidates = async (next: NextFunction) => {
  try {
    return await Candidate.find();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the GetAllCandidates service. ${e.message}`,
      ),
    );
  }
};

export const GetOneCandidate = async (_id: string, next: NextFunction) => {
  try {
    return await Candidate.findById(_id);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the GetOneCandidate service. ${e.message}`,
      ),
    );
  }
};

export const GetCandidateByName = async (name: string, next: NextFunction) => {
  try {
    return await Candidate.find({ name });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the GetCandidateByName service. ${e.message}`,
      ),
    );
  }
};

export const Create = async (candidateInfo: ICandidate, next: NextFunction) => {
  try {
    const job = await Job.findById(candidateInfo.job);
    const newCandidate = await Candidate.create({
      ...candidateInfo,
      main_status: 'interested',
      secondary_status: 'new entry',
      videos_question_list: job?.video_questions_list,
    });

    return newCandidate;
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate creation service. ${e.message}`,
      ),
    );
  }
};

export const UpdateInfo = async (
  _id: string,
  newCandidateInfo: UpdateCandidateInfoDto,
  next: NextFunction,
) => {
  try {
    await Candidate.findByIdAndUpdate(_id, newCandidateInfo);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate info update service. ${e.message}`,
      ),
    );
  }
};

export const UpdateStatus = async (
  _id: string,
  newStatus: UpdateStatusDto,
  next: NextFunction,
) => {
  try {
    await Candidate.findByIdAndUpdate(_id, newStatus);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate status update service. ${e.message}`,
      ),
    );
  }
};

export const UpdateConclusions = async (
  _id: string,
  newConclusions: UpdateConclusionsDto,
  next: NextFunction,
) => {
  try {
    await Candidate.findByIdAndUpdate(_id, { conclusions: newConclusions });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate conclusions update service. ${e.message}`,
      ),
    );
  }
};

export const GenerateUrl = async (
  candidate: ICandidate,
  next: NextFunction,
): Promise<TokenData | undefined> => {
  try {
    const newUrl = await VideoRecordingUrl.create({});
    const token = createToken(
      candidate,
      JWT_ACCESS_TOKEN_EXP,
      'access',
      newUrl.short_url,
    );
    await Candidate.findByIdAndUpdate(candidate._id, {
      video_recording_url: newUrl._id,
    });

    return token;
  } catch (e: any) {
    next(
      new InternalServerException(
        `There was an unexpected error with the url creation service. ${e.message}`,
      ),
    );
  }
};

export const GetVideoFromS3 = (key: string, next: NextFunction) => {
  try {
    const getParams = {
      Bucket: AWS_VIDEO_BUCKET_NAME,
      Key: key,
    };

    return s3.getObject(getParams).createReadStream();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the video download service. ${e.message}`,
      ),
    );
  }
};

export const UploadVideoToS3 = async (file: File, next: NextFunction) => {
  try {
    const fileStream = createReadStream(file.path);

    const uploadParams: UploadParams = {
      Bucket: AWS_VIDEO_BUCKET_NAME,
      Body: fileStream,
      Key: file.filename,
    };

    return await s3.upload(uploadParams).promise();
  } catch (e: any) {
    next(
      new InternalServerException(
        `There was an unexpected error with the video upload service. ${e.message}`,
      ),
    );
  }
};

export const SaveVideoKey = async (
  question_id: number,
  id: string,
  next: NextFunction,
  video_key: string,
) => {
  try {
    const candidate = await Candidate.findOneAndUpdate(
      { _id: id, $and: [{ 'videos_question_list.question_id': question_id }] },
      { $set: { 'videos_question_list.$.video_key': video_key } },
      { upsert: true },
    );
    await candidate!.save();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate question and video key setting service. ${e.message}`,
      ),
    );
  }
};

export const GetCV = async (key: string, next: NextFunction) => {
  try {
    const getParams = {
      Bucket: AWS_CV_BUCKET_NAME,
      Key: key,
    };

    return s3.getObject(getParams).createReadStream();
  } catch (e: any) {
    next(
      new InternalServerException(
        `There was an unexpected error with the cv download service. ${e.message}`,
      ),
    );
  }
};

export const UploadCV = async (cv: File, next: NextFunction) => {
  try {
    const fileStream = createReadStream(cv.path);

    const uploadParams: UploadParams = {
      Bucket: AWS_CV_BUCKET_NAME,
      Body: fileStream,
      Key: cv.filename,
    };

    return s3.upload(uploadParams).promise();
  } catch (e: any) {
    next(
      new InternalServerException(
        `There was an unexpected error with the cv upload service. ${e.message}`,
      ),
    );
  }
};

export const SetIsRejected = async (_id: string, next: NextFunction) => {
  try {
    await Candidate.findByIdAndUpdate(_id, { isRejected: true });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate rejection setting service. ${e.message}`,
      ),
    );
  }
};

export const DeleteUrl = async (
  short_url: string,
  next: NextFunction,
): Promise<void> => {
  try {
    await VideoRecordingUrl.deleteOne({ short_url });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the url deletion service. ${e.message}`,
      ),
    );
  }
};
