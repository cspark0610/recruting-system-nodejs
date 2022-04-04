import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import {
  valid_main_status,
  valid_secondary_status,
} from '../../../../config/validEnums';

export class UpdateStatusDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(valid_main_status)
  main_status?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(valid_secondary_status)
  secondary_status?: string;
}
