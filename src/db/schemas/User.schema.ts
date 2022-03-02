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
        question_id: Number,
        question_title: String,
        video_key: String,
      },
    ],

    index: {
      type: String,
      required: true,
      default: generate,
      unique: true,
    },

    cv: {
      type: String,
      required: true,
    },
  },

  { versionKey: false },
);

export default model('user', UserSchema);
