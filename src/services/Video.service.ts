import { createReadStream } from 'fs';
import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import File from '../interfaces/File.interface';
import UploadParams from '../interfaces/UploadParams.interface';
import Candidate from '../db/schemas/Candidate.schema';

dotenv.config();

const {
  AWS_BUCKET_REGION,
  AWS_BUCKET_ACCESS_KEY,
  AWS_BUCKET_SECRET_ACCESS_KEY,
  AWS_VIDEO_BUCKET_NAME,
} = process.env;

const s3 = new S3({
  accessKeyId: AWS_BUCKET_ACCESS_KEY,
  secretAccessKey: AWS_BUCKET_SECRET_ACCESS_KEY,
  region: AWS_BUCKET_REGION,
});

export const GetVideoFromS3 = (key: string) => {
  try {
    const getParams = {
      Bucket: AWS_VIDEO_BUCKET_NAME as string,
      Key: key,
    };

    return s3.getObject(getParams).createReadStream();
  } catch (e) {
    console.error(e);
  }
};

export const UploadVideoToS3 = async (file: File) => {
  try {
    const fileStream = createReadStream(file.path);

    const uploadParams: UploadParams = {
      Bucket: AWS_VIDEO_BUCKET_NAME as string,
      Body: fileStream,
      Key: file.filename,
    };

    return await s3.upload(uploadParams).promise();
  } catch (e) {
    console.error(e);
  }
};

export const SaveVideoKeyToUser = async (
  question_id: number,
  id: string,
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
    console.error(e);
  }
};
