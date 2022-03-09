import { Schema, model } from 'mongoose';
import IJob from '../../interfaces/schemas/IJob.interface';

const JobSchema = new Schema<IJob>(
  {
    title: String,
    designated: [String],
    candidates: [{ type: Schema.Types.ObjectId, ref: 'Candidate' }],
  },
  { versionKey: false },
);

export default model<IJob>('Job', JobSchema);
