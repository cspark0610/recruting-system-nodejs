import { Schema, model } from 'mongoose';
import { generate } from 'shortid';
import IJobUrl from '../../interfaces/schemas/IJobUrl.interface';

const JobUrlSchema = new Schema<IJobUrl>(
  {
    short_url: {
      type: String,
      required: true,
      unique: true,
      default: generate,
    },
  },
  { versionKey: false },
);

export default model<IJobUrl>('jobUrl', JobUrlSchema);
