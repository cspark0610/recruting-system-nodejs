import { NextFunction } from 'express';
import { createReadStream } from 'fs';
import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import File from '../interfaces/File.interface';
import UploadParams from '../interfaces/UploadParams.interface';
import Candidate from '../db/schemas/Candidate.schema';
import ICandidate from '../db/interfaces/ICandidate.interface';
import VideoRecordingUrl from '../db/schemas/VideoRecordingUrl.schema';
import IVideoRecordingUrl from '../db/interfaces/IVideoRecordingUrl.interface';
import InternalServerException from '../exceptions/InternalServerError';

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

export const CreateCandidate = async (
  candidateInfo: ICandidate,
  job_id: string,
  next: NextFunction,
) => {
  try {
    const newCandidate = await Candidate.create({
      ...candidateInfo,
      job: job_id,
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

export const GenerateUrl = async (
  next: NextFunction,
): Promise<IVideoRecordingUrl | undefined | void> => {
  try {
    const newUrl: IVideoRecordingUrl = await VideoRecordingUrl.create({});
    return newUrl;
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
