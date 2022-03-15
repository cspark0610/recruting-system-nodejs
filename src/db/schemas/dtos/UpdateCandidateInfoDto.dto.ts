/* eslint-disable indent */
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUrl,
  IsArray,
} from 'class-validator';

export default class UpdateCandidateInfoDto {
  @IsNotEmpty()
  @IsString()
  academic_training!: string;

  @IsNotEmpty()
  @IsNumber()
  salary_expectations!: number;

  @IsString()
  available_from?: string;

  @IsNotEmpty()
  @IsArray()
  skills!: Array<string>;

  @IsNotEmpty()
  @IsUrl()
  linkedin!: string;

  @IsUrl()
  portfolio?: string;

  @IsString()
  working_reason?: string;
}
