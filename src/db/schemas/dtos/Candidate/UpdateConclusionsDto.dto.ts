import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateConclusionsDto {
  @IsOptional()
  @IsString()
  good?: string;

  @IsOptional()
  @IsString()
  bad?: string;
}
