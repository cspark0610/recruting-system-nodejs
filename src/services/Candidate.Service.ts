/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
import { NextFunction } from 'express';
import { createReadStream } from 'fs';
import { createToken } from '../lib/jwt';
import {
  UpdateCandidateInfoDto,
  UpdateStatusDto,
} from '../db/schemas/dtos/Candidate';
import { valid_main_status, valid_secondary_status } from '../config/constants';
import envConfig from '../config/env';
import s3 from '../config/aws';
import File from '../interfaces/File.interface';
import UploadParams from '../interfaces/UploadParams.interface';
import Candidate from '../db/schemas/Candidate.schema';
import ICandidate from '../db/schemas/interfaces/ICandidate.interface';
import Position from '../db/schemas/Position.schema';
import User from '../db/schemas/User.schema';
import VideoRecordingUrl from '../db/schemas/VideoRecordingUrl.schema';
import InternalServerException from '../exceptions/InternalServerError';
import IConclusions from '../interfaces/IConclusions.interface';

const {
  AWS_VIDEO_BUCKET_NAME,
  AWS_CV_BUCKET_NAME,
  NODE_ENV,
  REDIRECT_URL_DEVELOPMENT,
  REDIRECT_URL_PRODUCTION,
  JWT_VIDEO_TOKEN_EXP,
} = envConfig;

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

export const GetCandidatesFiltered = async (
  next: NextFunction,
  position: Array<string>,
  status: Array<string>,
  query: string,
) => {
  try {
    if (query !== '') {
      return await Candidate.find({
        $or: [
          { position: { $in: position } },
          { secondary_status: { $in: status } },
          { name: { $regex: query, $options: 'i' } },
          { skills: { $regex: query, $options: 'i' } },
          { academic_training: { $regex: query, $options: 'i' } },
          { english_level: { $regex: query, $options: 'i' } },
          { country: { $regex: query, $options: 'i' } },
          { designated_recruiters: { $regex: query, $options: 'i' } },
        ],
      });
    } else {
      return await Candidate.find({
        $or: [
          { position: { $in: position } },
          { secondary_status: { $in: status } },
        ],
      });
    }
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the GetCandidatesFiltered service. ${e.message}`,
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

export const Create = async (candidateInfo: ICandidate, next: NextFunction) => {
  try {
    let position = await Position.findById(candidateInfo.position);
    const designatedUsers = await User.find({
      _id: { $in: position?.designated },
    });

    const userNames = designatedUsers.map((user) => user.name);

    const newCandidate = await Candidate.create({
      ...candidateInfo,
      main_status: 'interested',
      secondary_status: 'new entry',
      videos_question_list: position?.video_questions_list,
      designated_recruiters: userNames,
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
    if (
      newStatus.secondary_status ===
      valid_secondary_status[valid_secondary_status.length - 1]
    ) {
      const currentCandidate = await Candidate.findById(_id);
      const newMainStatus =
        valid_main_status.indexOf(currentCandidate!.main_status!) + 1;

      if (
        currentCandidate?.main_status! !==
        valid_main_status[valid_main_status.length - 1]
      ) {
        await Candidate.findByIdAndUpdate(_id, {
          main_status: valid_main_status[newMainStatus],
          secondary_status: valid_secondary_status[0],
        });

        return {
          main_status: valid_main_status[newMainStatus],
          secondary_status: valid_secondary_status[0],
        };
      }

      await Candidate.findByIdAndUpdate(_id, {
        secondary_status: newStatus.secondary_status,
      });

      return {
        main_status: currentCandidate!.main_status!,
        secondary_status: newStatus.secondary_status,
      };
    }

    await Candidate.findByIdAndUpdate(_id, newStatus);

    return newStatus;
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
  newConclusions: IConclusions,
  next: NextFunction,
) => {
  try {
    await Candidate.findByIdAndUpdate(_id, {
      $push: {
        'conclusions.good': newConclusions.good,
        'conclusions.bad': newConclusions.bad,
      },
    });
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
) => {
  try {
    const newUrl = await VideoRecordingUrl.create({});
    const token = createToken(
      candidate,
      JWT_VIDEO_TOKEN_EXP,
      'video',
      newUrl.short_url,
    );

    const url =
      NODE_ENV === 'development'
        ? `${REDIRECT_URL_DEVELOPMENT}/welcome?token=${token} `
        : `${REDIRECT_URL_PRODUCTION}/welcome?token=${token} `;

    await Candidate.findByIdAndUpdate(candidate._id, {
      video_recording_url: newUrl._id,
      url_link_2: url,
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
    const currentCandidateStatus = await Candidate.findById(_id);
    await Candidate.findByIdAndUpdate(_id, {
      isRejected: !currentCandidateStatus!.isRejected,
    });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate rejection setting service. ${e.message}`,
      ),
    );
  }
};

export const DisableUrl = async (
  short_url: string,
  next: NextFunction,
): Promise<void> => {
  try {
    await VideoRecordingUrl.findOneAndUpdate(
      { short_url },
      { isDisabled: true },
    );
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the url deletion service. ${e.message}`,
      ),
    );
  }
};
