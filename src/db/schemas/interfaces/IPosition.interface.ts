import { Types } from 'mongoose';
import IQuestion from '../../../interfaces/IQuestion.interface';

export default interface IPosition {
  _id?: Types.ObjectId;
  title: string;
  designated?: Array<string>;
  client_name: string;
  rie_link: string;
  recruiter_filter: string;
  url?: string;
  isActive?: boolean;
  skills_required: Array<string>;
  video_questions_list: Array<IQuestion>;
}
