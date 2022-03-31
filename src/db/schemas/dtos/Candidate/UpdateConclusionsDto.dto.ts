import { IsNotEmpty, IsObject } from 'class-validator';

export class UpdateConclusionsDto {
  @IsObject()
  @IsNotEmpty()
  conclusions!: object;
}
