/* eslint-disable indent */
import { IsNotEmpty, IsString } from "class-validator";

// eslint-disable-next-line import/prefer-default-export
export class UpdateCandidateEmploymentStatusDto {
	@IsNotEmpty()
	@IsString()
	employment_status!: string;
}
