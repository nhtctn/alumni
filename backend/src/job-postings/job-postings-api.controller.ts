import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateDirectJobPostingDto,
  ReplaceJobPostingDto,
  UpdateJobPostingDto,
} from './job-posting.dto';
import { JobPosting } from './job-posting.entity';
import { JobPostingsService } from './job-postings.service';

@Controller('api/jobs')
@ApiTags('Job postings')
export class JobPostingsApiController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a job posting' })
  @ApiBody({ type: CreateDirectJobPostingDto })
  @ApiResponse({ status: 201, type: JobPosting })
  @ApiResponse({ status: 400, description: 'Invalid job posting data.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async create(
    @Body() dto: CreateDirectJobPostingDto,
  ): Promise<JobPosting> {
    return this.jobPostingsService.createDirect(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all job postings ordered by ID' })
  @ApiResponse({ status: 200, type: [JobPosting] })
  async findAll(): Promise<JobPosting[]> {
    return this.jobPostingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a job posting by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, type: JobPosting })
  @ApiResponse({ status: 404, description: 'Job posting not found.' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<JobPosting> {
    return this.jobPostingsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Replace a job posting' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: ReplaceJobPostingDto })
  @ApiResponse({ status: 200, type: JobPosting })
  @ApiResponse({ status: 400, description: 'Invalid job posting data.' })
  @ApiResponse({ status: 404, description: 'Job posting not found.' })
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplaceJobPostingDto,
  ): Promise<JobPosting> {
    return this.jobPostingsService.replace(id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a job posting' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateJobPostingDto })
  @ApiResponse({ status: 200, type: JobPosting })
  @ApiResponse({ status: 400, description: 'Invalid job posting data.' })
  @ApiResponse({ status: 404, description: 'Job posting not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJobPostingDto,
  ): Promise<JobPosting> {
    return this.jobPostingsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a job posting' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 204, description: 'Job posting deleted.' })
  @ApiResponse({ status: 404, description: 'Job posting not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.jobPostingsService.remove(id);
  }
}
