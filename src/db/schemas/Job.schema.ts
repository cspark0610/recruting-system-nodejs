import { Schema, model } from 'mongoose';
import IJob from '../../interfaces/schemas/IJob.interface';

const JobSchema = new Schema<IJob>(
  {
    title: String,
    designated: [String],
  },
  { versionKey: false },
);

export default model<IJob>('job', JobSchema);
