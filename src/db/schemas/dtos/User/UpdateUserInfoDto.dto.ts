import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '.';

export class UpdateUserInfoDto extends PartialType(CreateUserDto) {}
