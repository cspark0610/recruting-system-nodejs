/* eslint-disable indent */
/* eslint-disable import/prefer-default-export */
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class ChangeRoleParamsDto {
  @IsMongoId()
  _id!: Types.ObjectId;
}
