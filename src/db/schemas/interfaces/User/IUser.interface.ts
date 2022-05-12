import { Types } from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  position_name?: string;
  picture?: string;
  phone?: string;
  role?: Types.ObjectId;
}
