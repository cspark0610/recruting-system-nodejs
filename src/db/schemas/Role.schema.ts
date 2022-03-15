import { Schema, model } from 'mongoose';
import { IRole } from './interfaces/User';

const RoleSchema = new Schema<IRole>(
  {
    name: String,
  },
  { versionKey: false },
);

export default model<IRole>('role', RoleSchema);
