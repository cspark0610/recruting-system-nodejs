import { Schema, model } from 'mongoose';
import ICandidate from '../../interfaces/ICandidate.interface';

const CandidateSchema = new Schema<ICandidate>(
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

export default model<ICandidate>('candidate', CandidateSchema);
