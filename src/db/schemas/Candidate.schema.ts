import { Schema, model } from 'mongoose';

const CandidateSchema = new Schema(
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

    cv: {
      type: String,
      required: false,
    },
  },

  { versionKey: false },
);

export default model('candidate', CandidateSchema);
