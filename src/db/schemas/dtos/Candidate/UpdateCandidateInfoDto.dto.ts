/* eslint-disable indent */
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  ArrayNotEmpty,
  MinLength,
} from 'class-validator';

// eslint-disable-next-line import/prefer-default-export
export class UpdateCandidateInfoDto {
  @IsNotEmpty()
  @IsString()
  academic_training!: string;

  @IsNotEmpty()
  @IsString()
  salary_expectations!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  available_from?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  skills!: Array<string>;

  @IsOptional()
  @IsString()
  working_reason?: string;
}
