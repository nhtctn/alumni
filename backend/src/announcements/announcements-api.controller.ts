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
  CreateAnnouncementDto,
  ReplaceAnnouncementDto,
  UpdateAnnouncementDto,
} from './announcement.dto';
import { Announcement } from './announcement.entity';
import { AnnouncementsService } from './announcements.service';

@Controller('api/announcements')
@ApiTags('Announcements')
export class AnnouncementsApiController {
  constructor(
    private readonly announcementsService: AnnouncementsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an announcement' })
  @ApiBody({ type: CreateAnnouncementDto })
  @ApiResponse({ status: 201, type: Announcement })
  @ApiResponse({ status: 400, description: 'Invalid announcement data.' })
  async create(@Body() dto: CreateAnnouncementDto): Promise<Announcement> {
    return this.announcementsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List announcements ordered by ID' })
  @ApiResponse({ status: 200, type: [Announcement] })
  async findAll(): Promise<Announcement[]> {
    return this.announcementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an announcement by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, type: Announcement })
  @ApiResponse({ status: 404, description: 'Announcement not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Announcement> {
    return this.announcementsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Replace an announcement' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: ReplaceAnnouncementDto })
  @ApiResponse({ status: 200, type: Announcement })
  @ApiResponse({ status: 400, description: 'Invalid announcement data.' })
  @ApiResponse({ status: 404, description: 'Announcement not found.' })
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplaceAnnouncementDto,
  ): Promise<Announcement> {
    return this.announcementsService.replace(id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update an announcement' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateAnnouncementDto })
  @ApiResponse({ status: 200, type: Announcement })
  @ApiResponse({ status: 400, description: 'Invalid announcement data.' })
  @ApiResponse({ status: 404, description: 'Announcement not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    return this.announcementsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an announcement' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 204, description: 'Announcement deleted.' })
  @ApiResponse({ status: 404, description: 'Announcement not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.announcementsService.remove(id);
  }
}
