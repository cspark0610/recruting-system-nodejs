import { Schema, model } from 'mongoose';
import ICandidate from '../../interfaces/schemas/ICandidate.interface';

const CandidateSchema = new Schema<ICandidate>(
  {
    name: { type: String, required: true },

    email: { type: String, required: true },

    phone: { type: Number, required: true },

    country: { type: String, required: true },

    job: { type: Schema.Types.ObjectId, ref: 'Job' },

    videos_question_list: [],

    cv: {
      type: String,
      required: true,
    },
  },

  { versionKey: false },
);

export default model<ICandidate>('Candidate', CandidateSchema);
