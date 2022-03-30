import IQuestion from '../../../interfaces/IQuestion.interface';

export default interface IJob {
  title: string;
  designated?: Array<string>;
  client_name: string;
  rie_link: string;
  recruiter_guidance: string;
  url?: string;
  skills_required: Array<string>;
  video_questions_list: Array<IQuestion>;
}
