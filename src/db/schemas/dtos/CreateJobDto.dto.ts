/* eslint-disable indent */
import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import IJob from '../../interfaces/IJob.interface';

export default class CreateJobDto implements IJob {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsArray()
  @IsNotEmpty()
  designated: Array<string> | undefined;
}
