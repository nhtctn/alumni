import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateJobPostingDto } from './job-posting.dto';
import { JobPosting } from './job-posting.entity';
import { JobPostingsService } from './job-postings.service';

@Controller('api/users/:userId/jobs')
@ApiTags('Job postings')
export class JobPostingsUserApiController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a job posting for a user' })
  @ApiParam({ name: 'userId', type: Number, example: 1 })
  @ApiBody({ type: CreateJobPostingDto })
  @ApiResponse({ status: 201, type: JobPosting })
  @ApiResponse({ status: 400, description: 'Invalid job posting data.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateJobPostingDto,
  ): Promise<JobPosting> {
    return this.jobPostingsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List a user’s job postings' })
  @ApiParam({ name: 'userId', type: Number, example: 1 })
  @ApiResponse({ status: 200, type: [JobPosting] })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<JobPosting[]> {
    return this.jobPostingsService.findByUser(userId);
  }
}
