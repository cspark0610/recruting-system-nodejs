import { Types } from 'mongoose';

export default interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: Array<Types.ObjectId>;
}
