import { IsNotEmpty, IsObject } from 'class-validator';
import IConclusions from '../../../../interfaces/IConclusions.interface';

export class UpdateConclusionsDto {
  @IsObject()
  @IsNotEmpty()
  conclusions!: IConclusions;
}
