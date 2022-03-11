import { Roles } from '../../../lib/enums';

export default interface IUser {
  name: string;
  email: string;
  password: string;
  role?: Roles;
}
