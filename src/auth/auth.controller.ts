import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';
import { RegisterDto } from './dtos/register.dto';

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
    const user = await this.usersService.findOneAndSelect({ email });
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

  @UseGuards(AuthGuard)
  @Get('admin/user')
  async user(@Req() req: Request) {
    const cookie = req.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(cookie);

    const user = await this.usersService.findOne({ id });

    return user;
  }

  @UseGuards(AuthGuard)
  @Post('admin/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');

    return {
      message: 'logout Success',
    };
  }

  @UseGuards(AuthGuard)
  @Put('admin/users/info')
  async updateUserInfo(
    @Req() req: Request,
    @Body('username') username: string,
    @Body('email') email: string,
  ) {
    const cookie = req.cookies['jwt'];
    const { id } = await this.jwtService.verifyAsync(cookie);

    await this.usersService.update(id, {
      username,
      email,
    });

    return this.usersService.findOne({ id });
  }

  @Put('admin/users/password')
  async updatePassword(
    @Req() req: Request,
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException('Password not match');
    }

    const cookie = req.cookies['jwt'];
    const { id } = await this.jwtService.verifyAsync(cookie);

    // const user = await this.usersService.findOneAndSelect({ id });

    // user.updateOne

    await this.usersService.update(id, {
      password: await bcrypt.hash(password, 12),
    });
    return this.usersService.findOne({ id });
  }
}
