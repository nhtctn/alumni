import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthController } from './health.controller';
import { UsersApiController } from './users/users-api.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  controllers: [
    AppController,
    HealthController,
    UsersApiController,
    UsersController,
  ],
  providers: [UsersService],
})
export class AppModule {}
