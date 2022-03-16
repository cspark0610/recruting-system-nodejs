/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
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
}
