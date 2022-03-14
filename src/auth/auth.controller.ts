import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Controller()
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin/register')
  async register(@Body() body: RegisterDto) {
    const { password_confirm, ...data } = body;

    if (body.password !== password_confirm) {
      throw new BadRequestException('Password not match');
    }

    const hashed = await bcrypt.hash(body.password, 12);

    return await this.usersService.create({
      ...data,
      password: hashed,
    });
  }
}
