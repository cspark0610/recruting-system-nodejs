import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateStatusDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  main_status?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  secondary_status?: string;
}
