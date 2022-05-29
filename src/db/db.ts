import mongoose from 'mongoose';
import { envConfig } from '../config';

const { NODE_ENV, MONGODB_STAGING_URI } = envConfig;

if (NODE_ENV === 'development') {
  mongoose.connect(MONGODB_STAGING_URI, (error) =>
    error
      ? console.error(error)
      : console.log(`Database connected in ${NODE_ENV} mode`),
  );
} else if (NODE_ENV === 'production') {
  mongoose.connect(MONGODB_STAGING_URI, (error) =>
    error
      ? console.error(error)
      : console.log(`Database connected in ${NODE_ENV} mode`),
  );
}
