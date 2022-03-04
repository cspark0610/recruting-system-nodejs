import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import { createReadStream } from 'fs';
import UploadParams from '../interfaces/UploadParams.interface';
import File from '../interfaces/File.interface';
import User from '../db/schemas/User.schema';

dotenv.config();

const {
  AWS_BUCKET_REGION,
  AWS_BUCKET_ACCESS_KEY,
  AWS_BUCKET_SECRET_ACCESS_KEY,
} = process.env;

const s3 = new S3({
  accessKeyId: AWS_BUCKET_ACCESS_KEY,
  secretAccessKey: AWS_BUCKET_SECRET_ACCESS_KEY,
  region: AWS_BUCKET_REGION,
});

export const GetCV = async (key: string) => {
  try {
    const getParams = {
      Bucket: 'candidatescvbucket',
      Key: key,
    };

    return s3.getObject(getParams).createReadStream();
  } catch (e: any) {
    console.error(e.message);
  }
};

const UploadCV = async (cv: File) => {
  try {
    const fileStream = createReadStream(cv.path);

    const uploadParams: UploadParams = {
      Bucket: 'candidatescvbucket',
      Body: fileStream,
      Key: cv.filename,
    };

    return s3.upload(uploadParams).promise();
  } catch (e: any) {
    console.error(e.message);
  }
};

export const SaveCVKeysIntoUser = async (userId: string, key?: string) => {
  try {
    await User.findOneAndUpdate({ id: userId }, { cv: key });
  } catch (e) {
    console.error(e);
  }
};

export default UploadCV;
