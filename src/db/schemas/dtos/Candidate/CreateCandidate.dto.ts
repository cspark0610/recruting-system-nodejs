/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import {
	IsString,
	IsNotEmpty,
	IsEmail,
	IsNumberString,
	IsOptional,
	MaxLength,
} from "class-validator";

export class CreateCandidateDto {
	@IsNotEmpty()
	@IsString()
	name!: string;

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email!: string;

	@IsNotEmpty()
	@IsNumberString()
	@MaxLength(9)
	phone!: string;

	@IsNotEmpty()
	@IsString()
	position!: string;

	@IsNotEmpty()
	@IsString()
	english_level!: string;

	@IsNotEmpty()
	@IsString()
	country!: string;

	@IsString()
	@IsNotEmpty()
	birth_date!: string;

	@IsString()
	//@IsNotEmpty()
	@IsOptional()
	linkedin?: string;

	@IsString()
	@IsOptional()
	portfolio?: string;

	@IsString()
	@IsNotEmpty()
	terms!: string;
}
