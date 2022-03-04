export default interface ITemp {
  video_data:
    | Array<{
        question_id: number;
        question_title: string;
        video_key: string;
        _id: string;
      }>
    | undefined;
  user_id: string;
  url_id: string;
  cv: string;
}
