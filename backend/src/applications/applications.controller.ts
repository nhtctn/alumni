import {
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { CreateApplicationDto } from './application.dto';
import { ApplicationsService } from './applications.service';
import { JobPostingsService } from '../job-postings/job-postings.service';

@Controller('applications')
@ApiExcludeController()
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly jobPostingsService: JobPostingsService,
  ) {}

  @Get('users/:userId')
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() response: Response,
  ): Promise<void> {
    try {
      response.render('applications/index', {
        applications: await this.applicationsService.findByUser(userId),
        userId,
      });
    } catch (error) {
      this.renderError(response, error);
    }
  }

  @Get('job-postings/:jobPostingId/new')
  async createForm(
    @Param('jobPostingId', ParseIntPipe) jobPostingId: number,
    @Res() response: Response,
  ): Promise<void> {
    try {
      response.render('applications/form', {
        jobPosting: await this.jobPostingsService.findOne(jobPostingId),
        action: `/applications/job-postings/${jobPostingId}`,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        response.status(404).render('applications/not-found', {
          message: error.message,
        });
        return;
      }
      throw error;
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ): Promise<void> {
    try {
      response.render('applications/detail', {
        application: await this.applicationsService.findOne(id),
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        response.status(404).render('applications/not-found', {
          message: error.message,
        });
        return;
      }
      throw error;
    }
  }

  @Post('job-postings/:jobPostingId')
  async create(
    @Param('jobPostingId', ParseIntPipe) jobPostingId: number,
    @Body() dto: CreateApplicationDto,
    @Res() response: Response,
  ): Promise<void> {
    try {
      await this.applicationsService.create(jobPostingId, dto);
      response.redirect(`/applications/users/${dto.userId}`);
    } catch (error) {
      this.renderError(response, error);
    }
  }

  @Post(':id/delete')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId') userId: number,
    @Res() response: Response,
  ): Promise<void> {
    try {
      await this.applicationsService.remove(id);
      response.redirect(`/applications/users/${userId}`);
    } catch (error) {
      this.renderError(response, error);
    }
  }

  private renderError(response: Response, error: unknown): void {
    if (error instanceof HttpException) {
      response.status(error.getStatus()).render('applications/error', {
        statusCode: error.getStatus(),
        message: error.message,
      });
      return;
    }
    throw error;
  }
}
