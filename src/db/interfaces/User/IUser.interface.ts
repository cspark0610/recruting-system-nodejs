import { Types } from 'mongoose';

export default interface IUser {
  name: string;
  email: string;
  password: string;
  role?: Array<Types.ObjectId>;
}
