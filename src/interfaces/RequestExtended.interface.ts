import { Request } from 'express';
import IUser from '../db/interfaces/User/IUser.interface';

export default interface RequestExtended extends Request {
  user?: IUser;
  designated?: Array<IUser>;
}
