import { Types, Document } from 'mongoose';
import { IQuestion } from '../../../interfaces';

export default interface IPosition extends Document {
  _id?: Types.ObjectId;
  title: string;
  designated: Array<string>;
  client_name: string;
  rie_link: string;
  recruiter_filter: string;
  url?: string;
  priority?: string;
  isActive?: boolean;
  skills_required?: Array<string>;
  video_questions_list?: Array<IQuestion>;
}

export interface IPositionNormal {
  _id?: Types.ObjectId;
  title: string;
  designated: Array<string>;
  client_name: string;
  rie_link: string;
  recruiter_filter: string;
  url?: string;
  priority?: string;
  isActive?: boolean;
  skills_required?: Array<string>;
  video_questions_list?: Array<IQuestion>;
}
