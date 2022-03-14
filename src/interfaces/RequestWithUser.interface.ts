import { Request } from 'express';
import IUser from '../db/interfaces/User/IUser.interface';

export default interface RequestWithUser extends Request {
  user: IUser;
}
