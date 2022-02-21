import { Schema, model } from 'mongoose';
import { generate } from 'shortid';

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    video_key: {
      type: String,
      required: false,
      unique: true,
    },

    index: {
      type: String,
      required: true,
      default: generate,
      unique: true,
    },
  },
  { versionKey: false },
);

export default model('user', UserSchema);
