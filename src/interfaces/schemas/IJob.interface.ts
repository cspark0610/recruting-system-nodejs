import { Types } from 'mongoose';

export default interface IJob {
  title: string;
  designated: Array<string>;
  candidates?: Types.Array<{}>;
}
