import { Types } from 'mongoose';
import { IQuestion, IConclusions } from '../../../interfaces';

export default interface ICandidate {
  _id?: string;
  name: string;
  email: string;
  phone: number;
  country: string;
  academic_training?: string;
  english_level: string;
  salary_expectations?: string;
  available_from?: string;
  skills?: Array<string>;
  linkedin?: string;
  portfolio?: string;
  working_reason?: string;
  conclusions?: IConclusions;
  main_status?: string;
  birth_date: string;
  secondary_status?: string;
  position?: Types.ObjectId;
  designated_recruiters?: Array<string>;
  video_recording_url?: Types.ObjectId;
  videos_question_list?: Array<IQuestion>;
  url_link_2?: string;
  cv?: string;
  isRejected?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
