/* eslint-disable prefer-arrow-callback */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from './interfaces/User';

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

    role: { type: Schema.Types.ObjectId, ref: 'role', autopopulate: true },
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
  function comparePassword(originalPassword, hashedPassword) {
    return bcrypt.compare(originalPassword, hashedPassword);
  },
);

export default model<IUser, UserModel>('user', UserSchema);
