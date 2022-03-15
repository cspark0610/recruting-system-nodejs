/* eslint-disable indent */
import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import IJob from '../../interfaces/IJob.interface';

// eslint-disable-next-line import/prefer-default-export
export class CreateJobDto implements IJob {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsArray()
  @IsNotEmpty()
  designated: Array<string> | undefined;
}
