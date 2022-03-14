import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async findAll() {
    return await this.userModel.find();
  }

  async create(options): Promise<User> {
    // this may be wrong!!!
    return await this.userModel.create(options);
  }
}
