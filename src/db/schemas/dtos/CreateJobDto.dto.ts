/* eslint-disable indent */
import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import IJob from '../../interfaces/IJob.interface';

export default class CreateJobDto implements IJob {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsArray()
  @IsNotEmpty()
  designated: Array<Types.ObjectId> | undefined;
}
