/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import { IsString, IsNotEmpty, IsEmail, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import IUser from '../../interfaces/User/IUser.interface';

export default class CreateUserDto implements IUser {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsArray()
  role!: Array<Types.ObjectId>;
}
