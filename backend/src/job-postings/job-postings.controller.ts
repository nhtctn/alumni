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
import {
  CreateJobPostingDto,
  ReplaceJobPostingDto,
} from './job-posting.dto';
import { JobPostingsService } from './job-postings.service';

@Controller('jobs')
@ApiExcludeController()
export class JobPostingsController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<void> {
    response.render('job-postings/index', {
      jobPostings: await this.jobPostingsService.findAll(),
    });
  }

  @Get('new')
  createForm(@Res() response: Response): void {
    response.render('job-postings/form', {
      title: 'Add a job posting',
      heading: 'Add a job posting',
      action: '/jobs',
      submitLabel: 'Create job posting',
    });
  }

  @Post()
  async create(
    @Body() dto: CreateJobPostingDto & { userId: number },
    @Res() response: Response,
  ): Promise<void> {
    try {
      const jobPosting = await this.jobPostingsService.create(dto.userId, dto);
      response.redirect(`/jobs/${jobPosting.id}`);
    } catch (error) {
      this.renderError(response, error);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ): Promise<void> {
    try {
      response.render('job-postings/detail', {
        jobPosting: await this.jobPostingsService.findOne(id),
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        response.status(404).render('job-postings/not-found', {
          message: error.message,
        });
        return;
      }
      throw error;
    }
  }

  @Get(':id/edit')
  async editForm(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ): Promise<void> {
    try {
      response.render('job-postings/form', {
        title: 'Edit job posting',
        heading: 'Edit job posting',
        action: `/jobs/${id}/edit`,
        submitLabel: 'Save changes',
        jobPosting: await this.jobPostingsService.findOne(id),
      });
    } catch (error) {
      this.renderError(response, error);
    }
  }

  @Post(':id/edit')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplaceJobPostingDto,
    @Res() response: Response,
  ): Promise<void> {
    try {
      await this.jobPostingsService.replace(id, dto);
      response.redirect(`/jobs/${id}`);
    } catch (error) {
      this.renderError(response, error);
    }
  }

  private renderError(response: Response, error: unknown): void {
    if (error instanceof HttpException) {
      response.status(error.getStatus()).render('job-postings/error', {
        statusCode: error.getStatus(),
        message: error.message,
      });
      return;
    }
    throw error;
  }
}
