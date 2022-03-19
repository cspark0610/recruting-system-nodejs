import dotenv from 'dotenv';
dotenv.config();

const envConfig = {
  AWS_BUCKET_ACCESS_KEY: process.env.AWS_BUCKET_ACCESS_KEY as string,
  AWS_BUCKET_SECRET_ACCESS_KEY: process.env
    .AWS_BUCKET_SECRET_ACCESS_KEY as string,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION as string,
  AWS_VIDEO_BUCKET_NAME: process.env.AWS_VIDEO_BUCKET_NAME as string,
  AWS_CV_BUCKET_NAME: process.env.AWS_CV_BUCKET_NAME as string,
  MONGODB_DEVELOPMENT_URI: process.env.MONGODB_DEVELOPMENT_URI as string,
  MONGODB_PRODUCTION_URI: process.env.MONGODB_PRODUCTION_URI as string,
  REDIRECT_URL_PRODUCTION: process.env.REDIRECT_URL_PRODUCTION as string,
  REDIRECT_URL_DEVELOPMENT: process.env.REDIRECT_URL_DEVELOPMENT as string,
  NODE_ENV: process.env.NODE_ENV as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
};

export default envConfig;
