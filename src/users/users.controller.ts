import { Controller, Get } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '../models/user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
