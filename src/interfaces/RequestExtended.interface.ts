import { Request } from 'express';
import { Types } from 'mongoose';
import { IUser } from '../db/schemas/interfaces/User';
import ICandidate from '../db/schemas/interfaces/ICandidate.interface';

export default interface RequestExtended extends Request {
  user?: IUser;
  designated?: Array<IUser>;
  candidate?: ICandidate;
  role?: Types.ObjectId;
}
