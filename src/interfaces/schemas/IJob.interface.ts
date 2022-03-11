import { Types } from 'mongoose';

export default interface IJob {
  title: string;
  designated?: Array<Types.ObjectId>;
  url?: string;
}
