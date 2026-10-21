import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { HealthController } from './health.controller'
import { AnnouncementsApiController } from './announcements/announcements-api.controller'
import { AnnouncementsController } from './announcements/announcements.controller'
import { AnnouncementsService } from './announcements/announcements.service'
import { UsersApiController } from './users/users-api.controller'
import { UsersController } from './users/users.controller'
import { UsersService } from './users/users.service'
import { JobPostingsApiController } from './job-postings/job-postings-api.controller'
import { JobPostingsUserApiController } from './job-postings/job-postings-user-api.controller'
import { JobPostingsService } from './job-postings/job-postings.service'
import { ApplicationsUserApiController } from './applications/applications-user-api.controller'
import { ApplicationsApiController } from './applications/applications-api.controller'
import { ApplicationsService } from './applications/applications.service'
import { ApplicationsController } from './applications/applications.controller'
import { JobPostingsController } from './job-postings/job-postings.controller'
import { HomeController } from './home.controller'

@Module({
  controllers: [
    AppController,
    HealthController,
    AnnouncementsApiController,
    AnnouncementsController,
    UsersApiController,
    UsersController,
    JobPostingsApiController, // Direct job-posting routes: /api/jobs
    JobPostingsUserApiController, // Nested user routes: /api/users/:userId/jobs
    ApplicationsApiController, // Direct application routes: /api/applications
    ApplicationsUserApiController, // Nested application routes for jobs and users
    JobPostingsController,
    ApplicationsController,
    HomeController,
  ],
  providers: [
    AnnouncementsService,
    UsersService,
    JobPostingsService,
    ApplicationsService,
  ],
})
export class AppModule {}
