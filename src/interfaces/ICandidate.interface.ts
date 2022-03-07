export default interface ICandidate {
  id: string;
  videos_question_list: Array<{
    question_id: number;
    question_title: string;
    video_key: string;
  }>;
  cv: string;
}
