import { Schema, model } from 'mongoose';
import {
  valid_main_status,
  valid_secondary_status,
} from '../../config/constants';
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
      enum: valid_main_status,
      required: true,
    },

    secondary_status: {
      type: String,
      enum: valid_secondary_status,
      required: true,
    },

    job: { type: Schema.Types.ObjectId, ref: 'job', autopopulate: true },

    designated_users: { type: [String], required: false },

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

    isRejected: { type: Boolean, required: true, default: false },
  },

  { versionKey: false, timestamps: true },
);

CandidateSchema.plugin(require('mongoose-autopopulate'));

export default model<ICandidate>('candidate', CandidateSchema);
