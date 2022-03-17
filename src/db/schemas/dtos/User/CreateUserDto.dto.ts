/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsUppercase,
} from 'class-validator';
import { Types } from 'mongoose';
import { IUser } from '../../interfaces/User';

// eslint-disable-next-line import/prefer-default-export
export class CreateUserDto implements IUser {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  role?: Types.ObjectId;
}
