import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from '.';

export class UpdateJobDto extends PartialType(CreateJobDto) {}
