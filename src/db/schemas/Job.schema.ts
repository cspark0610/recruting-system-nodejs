/* eslint-disable indent */
import { Schema, model } from 'mongoose';
import { generate } from 'shortid';
import IJob from '../../interfaces/schemas/IJob.interface';

const JobSchema = new Schema<IJob>(
  {
    title: String,
    designated: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    url: {
      type: String,
      unique: true,
      default:
        process.env.NODE_ENV === 'development'
          ? `${
              process.env.REDIRECT_URL_DEVELOPMENT
            }/info-upload?job_id=${generate()}`
          : `${
              process.env.REDIRECT_URL_PRODUCTION
            }/info-upload?job_id=${generate()}`,
    },
  },
  { versionKey: false },
);

export default model<IJob>('Job', JobSchema);
