import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import { createReadStream } from 'fs';
import UploadParams from '../interfaces/UploadParams.interface';
import File from '../interfaces/File.interface';
import Candidate from '../db/schemas/Candidate.schema';

dotenv.config();

const {
  AWS_BUCKET_REGION,
  AWS_BUCKET_ACCESS_KEY,
  AWS_BUCKET_SECRET_ACCESS_KEY,
  AWS_CV_BUCKET_NAME,
} = process.env;

const s3 = new S3({
  accessKeyId: AWS_BUCKET_ACCESS_KEY,
  secretAccessKey: AWS_BUCKET_SECRET_ACCESS_KEY,
  region: AWS_BUCKET_REGION,
});

export const GetCV = async (key: string) => {
  try {
    const getParams = {
      Bucket: AWS_CV_BUCKET_NAME as string,
      Key: key,
    };

    return s3.getObject(getParams).createReadStream();
  } catch (e: any) {
    console.error(e.message);
  }
};

export const UploadCV = async (cv: File) => {
  try {
    const fileStream = createReadStream(cv.path);

    const uploadParams: UploadParams = {
      Bucket: AWS_CV_BUCKET_NAME as string,
      Body: fileStream,
      Key: cv.filename,
    };

    return s3.upload(uploadParams).promise();
  } catch (e: any) {
    console.error(e.message);
  }
};

export const SaveCVKeysIntoUser = async (id: string, key?: string) => {
  try {
    await Candidate.findOneAndUpdate({ id }, { cv: key });
  } catch (e) {
    console.error(e);
  }
};
