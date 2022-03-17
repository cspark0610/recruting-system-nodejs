/* eslint-disable indent */
/* eslint-disable import/prefer-default-export */
import { IsJWT } from 'class-validator';

export class JwtValidationDto {
  @IsJWT()
  token!: string;
}
