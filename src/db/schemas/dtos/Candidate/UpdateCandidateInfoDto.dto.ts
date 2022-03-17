/* eslint-disable indent */
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsArray,
  IsOptional,
  IsInt,
  IsDateString,
} from 'class-validator';

// eslint-disable-next-line import/prefer-default-export
export class UpdateCandidateInfoDto {
  @IsNotEmpty()
  @IsString()
  academic_training!: string;

  @IsNotEmpty()
  @IsInt()
  salary_expectations!: number;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  available_from?: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  skills!: Array<string>;

  @IsNotEmpty()
  @IsUrl()
  linkedin!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  portfolio?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  working_reason?: string;
}
