require('dotenv').config();
const { createReadStream } = require('fs');
const S3 = require('aws-sdk/clients/s3');

const {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_BUCKET_ACCESS_KEY,
  AWS_BUCKET_SECRET_ACCESS_KEY,
} = process.env;

const s3 = new S3({
  accessKeyId: AWS_BUCKET_ACCESS_KEY,
  secretAccessKey: AWS_BUCKET_SECRET_ACCESS_KEY,
  region: AWS_BUCKET_REGION,
});

async function uploadVideoToS3(file) {
  try {
    const fileStream = createReadStream(file.path);

    const uploadParams = {
      Bucket: AWS_BUCKET_NAME,
      Body: fileStream,
      Key: file.filename,
    };

    return await s3.putObject(uploadParams).promise();
  } catch (e) {
    console.error(e);
  }
}

module.exports = uploadVideoToS3;
