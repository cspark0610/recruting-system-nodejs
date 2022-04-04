/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
import { Schema, model } from 'mongoose';
import IJob from './interfaces/IJob.interface';

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },

    client_name: { type: String, required: true },

    rie_link: { type: String, required: true },

    recruiter_filter: { type: String, required: true },

    designated: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: true,
      },
    ],

    skills_required: { type: [String], required: true },

    video_questions_list: {
      type: [
        {
          question_id: Number,
          question_title: String,
          video_key: String,
        },
      ],
      required: true,
    },

    url: {
      type: String,
    },

    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { versionKey: false },
);

JobSchema.plugin(require('mongoose-autopopulate'));

export default model<IJob>('job', JobSchema);
