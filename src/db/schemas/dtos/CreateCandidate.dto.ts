/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Types } from 'mongoose';
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
  job!: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  country!: string;
}
