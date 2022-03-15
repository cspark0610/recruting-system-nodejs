import { Schema, model } from 'mongoose';
import ICandidate from '../interfaces/ICandidate.interface';

const CandidateSchema = new Schema<ICandidate>(
  {
    name: { type: String, required: true },

    email: { type: String, required: true },

    phone: { type: Number, required: true },

    country: { type: String, required: true },

    academic_training: { type: String, required: false },

    salary_expectations: { type: Number, required: false },

    available_from: { type: String, required: false },

    skills: { type: [String], required: false },

    linkedin: { type: String, required: false },

    portfolio: { type: String, required: false },

    working_reason: { type: String, required: false },

    job: { type: Schema.Types.ObjectId, ref: 'Job', autopopulate: true },

    videos_question_list: [],

    cv: {
      type: String,
      required: true,
    },
  },

  { versionKey: false },
);

CandidateSchema.plugin(require('mongoose-autopopulate'));

export default model<ICandidate>('Candidate', CandidateSchema);
