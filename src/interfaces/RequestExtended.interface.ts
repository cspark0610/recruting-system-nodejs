import { Request } from 'express';
import { IUser } from '../db/schemas/interfaces/User';

export default interface RequestExtended extends Request {
  user?: IUser;
  designated?: Array<IUser>;
}
