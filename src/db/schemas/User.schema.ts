import { Schema, model } from 'mongoose';
import IUser from '../../interfaces/schemas/IUser.interface';

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

export default model<IUser>('User', UserSchema);
