import { Schema, model } from 'mongoose';
import { generate } from 'shortid';
import IVideoRecordingUrl from './interfaces/IVideoRecordingUrl.interface';

const VideoRecoringUrlSchema = new Schema<IVideoRecordingUrl>(
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

VideoRecoringUrlSchema.index({ expiresAt: 1 }, { expires: '24h' });

export default model<IVideoRecordingUrl>(
  'video_recording_url',
  VideoRecoringUrlSchema,
);
