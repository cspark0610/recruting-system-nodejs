/* eslint-disable import/prefer-default-export */
/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserSignInParamsDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;
}
