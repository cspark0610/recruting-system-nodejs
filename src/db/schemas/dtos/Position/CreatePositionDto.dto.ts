/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsObject,
  IsUrl,
  ArrayNotEmpty,
} from 'class-validator';
import IQuestion from '../../../../interfaces/IQuestion.interface';
import IPosition from '../../interfaces/IPosition.interface';

// eslint-disable-next-line import/prefer-default-export
export class CreatePositionDto implements IPosition {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  designated: Array<string> | undefined;

  @IsNotEmpty()
  @IsString()
  client_name!: string;

  @IsNotEmpty()
  @IsUrl()
  rie_link!: string;

  @IsNotEmpty()
  @IsString()
  recruiter_filter!: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  skills_required!: Array<string>;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsObject({ each: true })
  video_questions_list!: Array<IQuestion>;
}
