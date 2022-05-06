/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsUrl,
  ArrayNotEmpty,
} from 'class-validator';
import IPosition from '../../interfaces/IPosition.interface';

// eslint-disable-next-line import/prefer-default-export
export class CreatePositionDto implements IPosition {
  @IsString()
  @IsNotEmpty({ message: 'Position name is required' })
  title!: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty({ message: 'You must designate at least 1 recruiter' })
  @IsString({ each: true })
  designated!: Array<string>;

  @IsNotEmpty({ message: 'Client name is required' })
  @IsString()
  client_name!: string;

  @IsNotEmpty({ message: 'RIE link is required' })
  @IsUrl({ message: 'RIE link must be a valid URL' })
  rie_link!: string;

  @IsNotEmpty({ message: 'Recruiter filter is required' })
  @IsString({ message: 'Recruiter filter must be a valid URL' })
  @IsUrl({ message: 'Recruiter filter must be a valid URL' })
  recruiter_filter!: string;

  @IsString()
  @IsNotEmpty({ message: 'You must select a priority' })
  priority!: string;
}
