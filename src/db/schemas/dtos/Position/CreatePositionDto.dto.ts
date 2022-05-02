/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import { IsString, IsNotEmpty, IsArray, IsUrl } from 'class-validator';
import IPosition from '../../interfaces/IPosition.interface';

// eslint-disable-next-line import/prefer-default-export
export class CreatePositionDto implements IPosition {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  designated!: Array<string>;

  @IsNotEmpty()
  @IsString()
  client_name!: string;

  @IsNotEmpty()
  @IsUrl()
  rie_link!: string;

  @IsNotEmpty()
  @IsString()
  recruiter_filter!: string;

  @IsString()
  @IsNotEmpty()
  priority!: string;
}
