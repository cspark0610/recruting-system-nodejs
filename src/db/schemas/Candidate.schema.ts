import { Schema, model } from 'mongoose';
import ICandidate from './interfaces/ICandidate.interface';

const CandidateSchema = new Schema<ICandidate>(
  {
    name: { type: String, required: true },

    email: { type: String, required: true },

    phone: { type: Number, required: true },

    country: { type: String, required: true },

    academic_training: { type: String, required: false },

    salary_expectations: { type: String, required: false },

    available_from: { type: Date, required: false },

    english_level: { type: String, required: true },

    skills: { type: [String], required: false },

    linkedin: { type: String, required: false },

    portfolio: { type: String, required: false },

    working_reason: { type: String, required: false },

    conclusions: {
      good: { type: [String], required: false },

      bad: { type: [String], required: false },
    },

    main_status: {
      type: String,
      enum: ['interested', 'applying', 'meeting', 'chosen'],
      required: true,
    },

    secondary_status: {
      type: String,
      enum: ['new entry', 'doubting', 'dismissed', 'aproved'],
      required: true,
    },

    job: { type: Schema.Types.ObjectId, ref: 'job', autopopulate: true },

    video_recording_url: {
      type: Schema.Types.ObjectId,
      ref: 'video_recording_url',
      autopopulate: true,
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
      required: true,
    },
  },

  { versionKey: false },
);

CandidateSchema.plugin(require('mongoose-autopopulate'));

export default model<ICandidate>('candidate', CandidateSchema);
