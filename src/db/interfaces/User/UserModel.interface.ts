/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import IUser from './IUser.interface';

export default interface UserModel extends Model<IUser> {
  hashPassword(password: string, salt: number): Promise<string>;
  comparePassword(
    originalPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
