import { Types } from 'mongoose';
import IQuestion from '../../../interfaces/IQuestion.interface';

export default interface ICandidate {
  _id?: string;
  name: string;
  email: string;
  phone: number;
  country: string;
  academic_training?: string;
  salary_expectations?: number;
  available_from?: string;
  skills?: Array<string>;
  linkedin?: string;
  portfolio?: string;
  working_reason?: string;
  job: Types.ObjectId;
  video_recording_url?: Types.ObjectId;
  videos_question_list?: Types.Array<IQuestion>;
  cv?: string;
}
