import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthController } from './health.controller';
import { ApiUsersController } from './users/api-users.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  controllers: [
    AppController,
    HealthController,
    ApiUsersController,
    UsersController,
  ],
  providers: [UsersService],
})
export class AppModule {}
