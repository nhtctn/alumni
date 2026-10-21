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
  CreateDirectApplicationDto,
  ReplaceApplicationDto,
  UpdateApplicationDto,
} from './application.dto';
import { Application } from './application.entity';
import { ApplicationsService } from './applications.service';

@Controller('api/applications')
@ApiTags('Applications')
export class ApplicationsApiController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an application' })
  @ApiBody({ type: CreateDirectApplicationDto })
  @ApiResponse({ status: 201, type: Application })
  @ApiResponse({ status: 400, description: 'Invalid application data.' })
  @ApiResponse({ status: 404, description: 'User or job posting not found.' })
  @ApiResponse({ status: 409, description: 'User already applied.' })
  async create(
    @Body() dto: CreateDirectApplicationDto,
  ): Promise<Application> {
    return this.applicationsService.createDirect(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List applications ordered by ID' })
  @ApiResponse({ status: 200, type: [Application] })
  async findAll(): Promise<Application[]> {
    return this.applicationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an application by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, type: Application })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Application> {
    return this.applicationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Replace an application' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: ReplaceApplicationDto })
  @ApiResponse({ status: 200, type: Application })
  @ApiResponse({ status: 400, description: 'Invalid application data.' })
  @ApiResponse({ status: 404, description: 'Application or related resource not found.' })
  @ApiResponse({ status: 409, description: 'User already applied.' })
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplaceApplicationDto,
  ): Promise<Application> {
    return this.applicationsService.replace(id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update an application' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateApplicationDto })
  @ApiResponse({ status: 200, type: Application })
  @ApiResponse({ status: 400, description: 'Invalid application data.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationDto,
  ): Promise<Application> {
    return this.applicationsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an application' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 204, description: 'Application deleted.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.applicationsService.remove(id);
  }
}
