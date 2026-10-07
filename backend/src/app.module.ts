import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthController } from './health.controller';
import { AnnouncementsApiController } from './announcements/announcements-api.controller';
import { AnnouncementsController } from './announcements/announcements.controller';
import { AnnouncementsService } from './announcements/announcements.service';
import { UsersApiController } from './users/users-api.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  controllers: [
    AppController,
    HealthController,
    AnnouncementsApiController,
    AnnouncementsController,
    UsersApiController,
    UsersController,
  ],
  providers: [AnnouncementsService, UsersService],
})
export class AppModule {}
