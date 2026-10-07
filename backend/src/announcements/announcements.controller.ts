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
import type { Response } from 'express';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from './announcement.dto';
import { AnnouncementsService } from './announcements.service';

@Controller('announcements')
export class AnnouncementsController {
  constructor(
    private readonly announcementsService: AnnouncementsService,
  ) {}

  @Get()
  findAll(@Res() response: Response): void {
    response.render('announcements/index', {
      announcements: this.announcementsService.findAll(),
    });
  }

  @Get('new')
  createForm(@Res() response: Response): void {
    response.render('announcements/form', {
      title: 'Add an announcement',
      heading: 'Add an announcement',
      action: '/announcements',
      submitLabel: 'Create announcement',
    });
  }

  @Post()
  create(
    @Body() dto: CreateAnnouncementDto,
    @Res() response: Response,
  ): void {
    try {
      const announcement = this.announcementsService.create(dto);
      response.redirect(`/announcements/${announcement.id}`);
    } catch (error) {
      this.renderError(response, error);
    }
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ): void {
    try {
      response.render('announcements/detail', {
        announcement: this.announcementsService.findOne(id),
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        response.status(404).render('announcements/not-found', {
          message: error.message,
        });
        return;
      }
      throw error;
    }
  }

  @Get(':id/edit')
  editForm(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ): void {
    try {
      response.render('announcements/form', {
        title: 'Edit announcement',
        heading: 'Edit announcement',
        action: `/announcements/${id}/edit`,
        submitLabel: 'Save changes',
        announcement: this.announcementsService.findOne(id),
      });
    } catch (error) {
      this.renderError(response, error);
    }
  }

  @Post(':id/edit')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAnnouncementDto,
    @Res() response: Response,
  ): void {
    try {
      this.announcementsService.update(id, dto);
      response.redirect(`/announcements/${id}`);
    } catch (error) {
      this.renderError(response, error);
    }
  }

  @Post(':id/delete')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ): void {
    try {
      this.announcementsService.remove(id);
      response.redirect('/announcements');
    } catch (error) {
      this.renderError(response, error);
    }
  }

  private renderError(response: Response, error: unknown): void {
    if (error instanceof HttpException) {
      response.status(error.getStatus()).render('announcements/error', {
        statusCode: error.getStatus(),
        message: error.message,
      });
      return;
    }
    throw error;
  }
}
