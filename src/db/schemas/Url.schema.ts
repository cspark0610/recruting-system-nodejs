import { Schema, model } from 'mongoose';
import { generate } from 'shortid';

const UrlSchema = new Schema(
  {
    short_url: {
      type: String,
      required: true,
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

export default model('Url', UrlSchema);
