import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'development') {
  mongoose.connect(process.env.MONGODB_DEVELOPMENT_URI as string, (error) => (error ? console.error(error) : console.log('database connected')));
} else if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_PRODUCTION_URI as string, (error) => (error ? console.error(error) : console.log('database connected')));
}
