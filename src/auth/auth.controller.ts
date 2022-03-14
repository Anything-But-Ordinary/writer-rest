import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
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

  @Post('admin/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}
