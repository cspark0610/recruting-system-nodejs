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

    isDisabled: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { versionKey: false },
);

export default model<IVideoRecordingUrl>(
  'video_recording_url',
  VideoRecoringUrlSchema,
);
