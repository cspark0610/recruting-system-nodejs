import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  new_password!: string;

  @IsString()
  @IsNotEmpty()
  old_password!: string;
}
