import dotenv from 'dotenv';
import { createReadStream } from 'fs';
import S3 from 'aws-sdk/clients/s3';
import File from '../interfaces/File.interface';

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

export async function uploadVideoToS3(file: File) {
  try {
    const fileStream = createReadStream(file.path);

    const uploadParams = {
      Bucket: 'videorecorderbucket',
      Body: fileStream,
      Key: file.filename,
    };

    return await s3.upload(uploadParams).promise();
  } catch (e: any) {
    console.error(e);
  }
}

export function GetVideoFromS3(key: string) {
  try {
    const getParams = {
      Bucket: 'videorecorderbucket',
      Key: key,
    };

    return s3.getObject(getParams).createReadStream();
  } catch (e: any) {
    console.error(e);
  }
}
