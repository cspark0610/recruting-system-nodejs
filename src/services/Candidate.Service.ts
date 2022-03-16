/* eslint-disable no-underscore-dangle */
import { NextFunction } from 'express';
import { createReadStream } from 'fs';
import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import File from '../interfaces/File.interface';
import UploadParams from '../interfaces/UploadParams.interface';
import Candidate from '../db/schemas/Candidate.schema';
import ICandidate from '../db/schemas/interfaces/ICandidate.interface';
import VideoRecordingUrl from '../db/schemas/VideoRecordingUrl.schema';
import InternalServerException from '../exceptions/InternalServerError';
import { UpdateCandidateInfoDto } from '../db/schemas/dtos/Candidate';
import TokenData from '../interfaces/TokenData.interface';
import { createToken } from '../lib/jwt';

dotenv.config();

const {
  AWS_BUCKET_REGION,
  AWS_BUCKET_ACCESS_KEY,
  AWS_BUCKET_SECRET_ACCESS_KEY,
  AWS_VIDEO_BUCKET_NAME,
  AWS_CV_BUCKET_NAME,
} = process.env;

const s3 = new S3({
  accessKeyId: AWS_BUCKET_ACCESS_KEY,
  secretAccessKey: AWS_BUCKET_SECRET_ACCESS_KEY,
  region: AWS_BUCKET_REGION,
});

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

export const CreateCandidate = async (
  candidateInfo: ICandidate,
  next: NextFunction,
) => {
  try {
    const newCandidate = await Candidate.create(candidateInfo);

    return newCandidate;
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate creation service. ${e.message}`,
      ),
    );
  }
};

export const UpdateCandidateInfo = async (
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

export const GenerateUrl = async (
  candidate: ICandidate,
  next: NextFunction,
): Promise<TokenData | undefined | void> => {
  try {
    const newUrl = await VideoRecordingUrl.create({});
    const token = createToken(candidate, newUrl.short_url);
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
      Bucket: AWS_VIDEO_BUCKET_NAME as string,
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
      Bucket: AWS_VIDEO_BUCKET_NAME as string,
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

export const SaveVideoKeyToUser = async (
  question_id: number,
  id: string,
  next: NextFunction,
  video_key?: string,
) => {
  try {
    const candidate = await Candidate.findOneAndUpdate(
      {
        id,
        $and: [{ 'videos_question_list.question_id': question_id }],
      },
      {
        $set: {
          'videos_question_list.$.video_key': video_key,
        },
      },
      { upsert: true },
    );
    await candidate?.save();
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
      Bucket: AWS_CV_BUCKET_NAME as string,
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
      Bucket: AWS_CV_BUCKET_NAME as string,
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

export const SaveCVKeysIntoUser = async (
  id: string,
  next: NextFunction,
  key?: string,
) => {
  try {
    await Candidate.findOneAndUpdate({ id }, { cv: key });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate cv key setting service. ${e.message}`,
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
