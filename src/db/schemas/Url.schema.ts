import { Schema, model } from 'mongoose';
import { generate } from 'shortid';
import IUrl from '../../interfaces/IUrl.interface';

const UrlSchema = new Schema<IUrl>(
  {
    short_url: {
      type: String,
      required: true,
      unique: true,
      default: generate,
    },

    expiresAt: {
      type: Date,
      default: new Date(),
      index: { expires: '24h' },
    },
  },
  { versionKey: false },
);

UrlSchema.index({ expiresAt: 1 }, { expires: '24h' });

export default model<IUrl>('Url', UrlSchema);
