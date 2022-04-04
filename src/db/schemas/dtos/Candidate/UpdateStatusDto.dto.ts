import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['interested', 'applying', 'meeting', 'chosen'])
  main_status?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['new entry', 'doubting', 'dismissed', 'aproved'])
  secondary_status?: string;
}
