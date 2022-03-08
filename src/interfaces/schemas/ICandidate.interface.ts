import IQuestion from '../IQuestion.interface';

export default interface ICandidate {
  id?: string;
  name: string;
  email: string;
  phone: number;
  country: string;
  videos_question_list?: Array<IQuestion>;
  cv?: string;
}
