import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreateApplicationDto } from './application.dto'
import { Application } from './application.entity'
import { ApplicationsService } from './applications.service'

@Controller()
@ApiTags('Applications')
export class ApplicationsUserApiController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('api/jobs/:jobPostingId/applications')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Apply to a job posting' })
  @ApiParam({ name: 'jobPostingId', type: Number, example: 1 })
  @ApiBody({ type: CreateApplicationDto })
  @ApiResponse({ status: 201, type: Application })
  @ApiResponse({ status: 400, description: 'Invalid application data.' })
  @ApiResponse({
    status: 404,
    description: 'Job posting or user not found.',
  })
  @ApiResponse({ status: 409, description: 'User already applied.' })
  async create(
    @Param('jobPostingId', ParseIntPipe) jobPostingId: number,
    @Body() dto: CreateApplicationDto,
  ): Promise<Application> {
    return this.applicationsService.create(jobPostingId, dto)
  }

  @Get('api/jobs/:jobPostingId/applications')
  @ApiOperation({ summary: 'List job posting applicants' })
  @ApiParam({ name: 'jobPostingId', type: Number, example: 1 })
  @ApiResponse({ status: 200, type: [Application] })
  @ApiResponse({ status: 404, description: 'Job posting not found.' })
  async findByJobPosting(
    @Param('jobPostingId', ParseIntPipe) jobPostingId: number,
  ): Promise<Application[]> {
    return this.applicationsService.findByJobPosting(jobPostingId)
  }

  @Get('api/users/:userId/applications')
  @ApiOperation({ summary: 'List a user’s job applications' })
  @ApiParam({ name: 'userId', type: Number, example: 1 })
  @ApiResponse({ status: 200, type: [Application] })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Application[]> {
    return this.applicationsService.findByUser(userId)
  }
}
