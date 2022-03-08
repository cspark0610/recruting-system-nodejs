export default interface ICandidate {
  id?: string;
  name: string;
  email: string;
  phone: number;
  country: string;
  videos_question_list?: Array<{
    question_id: number;
    question_title: string;
    video_key: string;
  }>;
  cv?: string;
}
