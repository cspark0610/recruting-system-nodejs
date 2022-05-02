/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import { IsString, IsNotEmpty, IsEmail, IsNumberString } from 'class-validator';
import ICandidate from '../../interfaces/ICandidate.interface';

// eslint-disable-next-line import/prefer-default-export
export class CreateCandidateDto implements ICandidate {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsNumberString()
  phone!: number;

  @IsNotEmpty()
  @IsString()
  english_level!: string;

  @IsString()
  @IsNotEmpty()
  birth_date!: string;

  @IsNotEmpty()
  @IsString()
  country!: string;
}
