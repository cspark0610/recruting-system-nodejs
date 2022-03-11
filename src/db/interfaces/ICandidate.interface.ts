import { Types } from 'mongoose';
import IQuestion from '../../interfaces/IQuestion.interface';

export default interface ICandidate {
  id?: string;
  name: string;
  email: string;
  phone: number;
  country: string;
  job?: Types.ObjectId;
  videos_question_list?: Types.Array<IQuestion>;
  cv?: string;
}
