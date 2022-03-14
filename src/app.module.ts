import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://localhost/writer-2'),
    UsersModule,
    SharedModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
