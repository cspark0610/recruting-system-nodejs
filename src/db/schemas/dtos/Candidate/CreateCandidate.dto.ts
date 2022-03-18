/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumberString,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';
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
  @IsMongoId()
  job!: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  english_level!: string;

  @IsNotEmpty()
  @IsString()
  country!: string;
}
