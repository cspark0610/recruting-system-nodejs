/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import ICandidate from '../../interfaces/ICandidate.interface';

export default class CreateCandidateDto implements ICandidate {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  phone!: number;

  @IsNotEmpty()
  @IsString()
  country!: string;
}
