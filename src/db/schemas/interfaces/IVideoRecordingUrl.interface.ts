import { Types } from 'mongoose';

export default interface IVideoRecordingUrl {
  _id: Types.ObjectId;
  short_url: string;
  expiresAt: Date;
}
