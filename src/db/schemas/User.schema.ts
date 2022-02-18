import { Schema, model } from 'mongoose';
import { generate } from 'shortid';

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    video_key: {
      type: String,
      required: false,
    },

    index: {
      type: String,
      required: true,
      default: generate,
    },
  },
  { versionKey: false },
);

export default model('user', UserSchema);
