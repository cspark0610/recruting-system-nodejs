import mongoose from 'mongoose';
import envConfig from '../config/env';

const { NODE_ENV, MONGODB_DEVELOPMENT_URI, MONGODB_STAGING_URI } = envConfig;

if (NODE_ENV === 'development') {
  mongoose.connect(MONGODB_DEVELOPMENT_URI, (error) =>
    error ? console.error(error) : console.log('database connected'),
  );
} else if (NODE_ENV === 'production') {
  mongoose.connect(MONGODB_STAGING_URI, (error) =>
    error ? console.error(error) : console.log('database connected'),
  );
}
