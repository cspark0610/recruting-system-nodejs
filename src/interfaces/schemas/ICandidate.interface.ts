import { Types } from 'mongoose';
import IQuestion from '../IQuestion.interface';

export default interface ICandidate {
  id?: string;
  name: string;
  email: string;
  phone: number;
  country: string;
  videos_question_list?: Types.Array<IQuestion>;
  cv?: string;
}
