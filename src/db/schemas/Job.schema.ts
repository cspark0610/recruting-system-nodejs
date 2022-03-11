/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
import { Schema, model } from 'mongoose';
import IJob from '../../interfaces/schemas/IJob.interface';

const JobSchema = new Schema<IJob>(
  {
    title: String,
    designated: [
      { type: Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    ],
    url: {
      type: String,
      unique: true,
    },
  },
  { versionKey: false },
);

JobSchema.plugin(require('mongoose-autopopulate'));

export default model<IJob>('Job', JobSchema);
