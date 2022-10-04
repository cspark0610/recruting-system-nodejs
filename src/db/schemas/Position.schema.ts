/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
import { Aggregate, AggregatePaginateModel, Document, PaginateModel, PaginateOptions, Schema, model } from 'mongoose';

import IPosition from '../schemas/interfaces/IPosition.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import mongoosePaginate from 'mongoose-paginate-v2';
import { valid_priorities } from '../../config';

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
PositionSchema.plugin(mongoosePaginate);
PositionSchema.plugin(aggregatePaginate)

interface PositionModel<T extends Document> extends  AggregatePaginateModel<T>,PaginateModel<T> {
}
const PositionModel: PositionModel<IPosition> = model<IPosition>(
  'position',
  PositionSchema,
) as PositionModel<IPosition>;
export default PositionModel;
