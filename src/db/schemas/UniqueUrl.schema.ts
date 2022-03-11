import { Schema, model } from 'mongoose';
import { generate } from 'shortid';
import IUrl from '../../interfaces/schemas/IUrl.interface';

const UniqueUrlSchema = new Schema<IUrl>(
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

UniqueUrlSchema.index({ expiresAt: 1 }, { expires: '24h' });

export default model<IUrl>('uniqueUrl', UniqueUrlSchema);
