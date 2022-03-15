import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { classToPlain } from 'class-transformer';

@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({
      id: user.id,
    });

    res.cookie('jwt', jwt, {
      httpOnly: true,
    });

    return {
      message: 'Success',
    };
  }

  @Get('admin/user')
  async user(@Req() req: Request) {
    const cookie = req.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(cookie);

    const user = await this.usersService.findOne({ id });

    return user;
  }
}
