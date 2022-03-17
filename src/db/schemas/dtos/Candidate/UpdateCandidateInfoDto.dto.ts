/* eslint-disable indent */
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsArray,
  IsOptional,
  IsInt,
  IsDateString,
  ArrayNotEmpty,
  MinLength,
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
  available_from?: Date;

  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty()
  @IsString({ each: true })
  @MinLength(3, { each: true })
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
