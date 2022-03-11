/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
import { Schema, model } from 'mongoose';
import IJob from '../interfaces/IJob.interface';

const JobSchema = new Schema<IJob>(
  {
    title: String,
    designated: [
      { type: Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    ],
    url: {
      type: String,
    },
  },
  { versionKey: false },
);

JobSchema.plugin(require('mongoose-autopopulate'));

export default model<IJob>('Job', JobSchema);
