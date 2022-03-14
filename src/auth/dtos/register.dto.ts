import { IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  password_confirm: string;
}
