import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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
      default: uuidv4(),
    },
  },
  { versionKey: false },
);

export default model('user', UserSchema);
