/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
import { Schema, model } from 'mongoose';
import { valid_priorities } from '../../config/constants';
import IPosition from '../schemas/interfaces/IPosition.interface';

const PositionSchema = new Schema<IPosition>(
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

    skills_required: { type: [String], required: false },

    video_questions_list: {
      type: [
        {
          question_id: Number,
          question_title: String,
          video_key: String,
        },
      ],
      required: false,
    },

    url: {
      type: String,
    },

    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },

    priority: { type: String, enum: valid_priorities, required: true },
  },
  { versionKey: false },
);

PositionSchema.plugin(require('mongoose-autopopulate'));

export default model<IPosition>('position', PositionSchema);
