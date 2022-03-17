/* eslint-disable indent */
import { IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export default class ValidateUrlParamsDto {
  @IsOptional()
  @IsMongoId()
  _id!: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  candidate_id!: Types.ObjectId;
}
