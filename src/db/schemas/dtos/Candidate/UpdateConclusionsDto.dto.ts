import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateConclusionsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  good?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bad?: string;
}
