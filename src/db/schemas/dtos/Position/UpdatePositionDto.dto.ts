import { PartialType } from '@nestjs/mapped-types';
import { CreatePositionDto } from '.';

export class UpdatePositionDto extends PartialType(CreatePositionDto) {}
