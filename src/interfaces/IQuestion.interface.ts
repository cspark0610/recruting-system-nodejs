import { Types } from 'mongoose';

export interface IQuestion {
  _id: Types.ObjectId;
  question_id: number;
  question_title: string;
  video_key: string;
}
