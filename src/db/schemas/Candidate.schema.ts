import { Schema, model } from 'mongoose';
import ICandidate from '../../interfaces/schemas/ICandidate.interface';

const CandidateSchema = new Schema<ICandidate>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    name: { type: String, required: true },

    email: { type: String, required: true },

    phone: { type: Number, required: true },

    country: { type: String, required: true },

    videos_question_list: [],

    cv: {
      type: String,
      required: true,
    },
  },

  { versionKey: false },
);

export default model<ICandidate>('Candidate', CandidateSchema);
