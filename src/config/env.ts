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
  MONGODB_STAGING_URI: process.env.MONGODB_STAGING_URI as string,
  REDIRECT_URL_PRODUCTION: process.env.REDIRECT_URL_PRODUCTION as string,
  REDIRECT_URL_DEVELOPMENT: process.env.REDIRECT_URL_DEVELOPMENT as string,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
  JWT_ACCESS_TOKEN_EXP: process.env.JWT_ACCESS_TOKEN_EXP as string,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
  JWT_REFRESH_TOKEN_EXP: process.env.JWT_REFRESH_TOKEN_EXP as string,
  NODE_ENV: process.env.NODE_ENV as string,
};

export default envConfig;
