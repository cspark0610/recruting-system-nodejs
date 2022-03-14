/* eslint-disable prefer-arrow-callback */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import IUser from '../interfaces/User/IUser.interface';
import UserModel from '../interfaces/User/UserModel.interface';

const UserSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: [{ type: Schema.Types.ObjectId, ref: 'role', autopopulate: true }],
  },
  { versionKey: false },
);

UserSchema.plugin(require('mongoose-autopopulate'));

UserSchema.static(
  'hashPassword',
  function hashPassword(password: string, salt: number) {
    return bcrypt.hash(password, salt);
  },
);

UserSchema.static(
  'comparePassword',
  function comparePassword(originalPassword: string, hashedPassword: string) {
    return bcrypt.compare(originalPassword, hashedPassword);
  },
);

export default model<IUser, UserModel>('User', UserSchema);
