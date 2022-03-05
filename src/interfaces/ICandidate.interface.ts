export default interface ICandidate {
  _id: string;
  id: string;
  videos_question_list: Array<{
    question_id: number;
    question_title: string;
    video_key: string;
    _id: string;
  }>;
  cv: string;
}
