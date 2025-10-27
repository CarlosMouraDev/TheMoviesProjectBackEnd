import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  newPassword: string;
}
