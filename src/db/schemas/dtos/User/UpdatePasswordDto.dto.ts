import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8, {
    message: 'Your new password must be at least 8 characters long',
  })
  @IsNotEmpty({ message: 'New password is required' })
  new_password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter your current password' })
  old_password!: string;
}
