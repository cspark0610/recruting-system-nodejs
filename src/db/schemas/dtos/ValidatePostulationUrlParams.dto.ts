/* eslint-disable indent */
import { IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";

export default class ValidatePostulationUrlParamsDto {
	@IsOptional()
	@IsMongoId()
	_id!: Types.ObjectId;

	// @IsOptional()
	// @IsMongoId()
	// candidate_id!: Types.ObjectId;

	@IsOptional()
	@IsMongoId()
	postulation_id!: Types.ObjectId;
}
