const { createReadStream } = require('fs');
const S3 = require('aws-sdk/clients/s3');
require('dotenv').config();

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

async function UploadVideoToS3(file) {
  try {
    const fileStream = createReadStream(file.path);

    const uploadParams = {
      Bucket: 'videorecorderbucket',
      Body: fileStream,
      Key: file.filename,
    };

    return await s3.upload(uploadParams).promise();
  } catch (e) {
    console.error(e);
  }
}

function GetVideoFromS3(key) {
  try {
    const getParams = {
      Bucket: 'videorecorderbucket',
      Key: key,
    };

    return s3.getObject(getParams).createReadStream();
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  GetVideoFromS3,
  UploadVideoToS3,
};
