export default interface IUser {
  _id: string;
  id: string;
  videos_question_list: Array<{
    question_id: string;
    question_title: string;
    video_key: string;
  }>;
  index: string;
}
