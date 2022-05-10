/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsUppercase,
  IsIn,
} from 'class-validator';
import { Types } from 'mongoose';
import { IUser } from '../../interfaces/User';

// eslint-disable-next-line import/prefer-default-export
export class CreateUserDto implements IUser {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name!: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({ message: 'Email is not valid' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  position_name!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  @IsIn(['CEO', 'CTO', 'RRHH ADMIN', 'RRHH', 'COMMON'], {
    message: 'Position is not valid',
  })
  role?: Types.ObjectId;
}
