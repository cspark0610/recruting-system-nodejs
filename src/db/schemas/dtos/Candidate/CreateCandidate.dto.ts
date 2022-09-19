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

// import ICandidate from "../../interfaces/ICandidate.interface";

// eslint-disable-next-line import/prefer-default-export
//implements ICandidate
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
	@IsNotEmpty()
	linkedin!: string;

	@IsString()
	//@IsNotEmpty()
	@IsOptional()
	portfolio?: string;

	@IsString()
	@IsNotEmpty()
	terms!: string;
}
