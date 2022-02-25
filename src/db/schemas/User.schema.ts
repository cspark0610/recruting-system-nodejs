import { Schema, model } from 'mongoose';
import { generate } from 'shortid';

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    videos_question_list: [
      {
        question_id: String,
        question_title: String,
        video_key: {
          type: String,
          required: false,
          unique: false,
        },
      },
    ],

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
