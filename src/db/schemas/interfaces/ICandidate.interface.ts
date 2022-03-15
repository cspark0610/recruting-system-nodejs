import { Types } from 'mongoose';
import IQuestion from '../../interfaces/IQuestion.interface';

export default interface ICandidate {
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
  videos_question_list?: Types.Array<IQuestion>;
  cv?: string;
}
