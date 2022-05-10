/* eslint-disable import/prefer-default-export */
/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserSignInParamsDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  @IsEmail({ message: 'Email not valid' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 6 characters long' })
  password!: string;
}
