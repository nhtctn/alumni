import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  NotFoundException,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Res() response: Response): void {
    response.render('users/index', { users: this.usersService.findAll() });
  }

  @Get('new')
  createForm(@Res() response: Response): void {
    response.render('users/form', {
      title: 'Add a user',
      heading: 'Add a user',
      action: '/users',
      submitLabel: 'Create user',
    });
  }

  @Post()
  create(
    @Body() dto: CreateUserDto,
    @Res() response: Response,
  ): void {
    try {
      const user = this.usersService.create(dto);
      response.redirect(`/users/${user.id}`);
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
      response.render('users/detail', { user: this.usersService.findOne(id) });
    } catch (error) {
      if (error instanceof NotFoundException) {
        response.status(404).render('users/not-found', {
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
      response.render('users/form', {
        title: 'Edit user',
        heading: 'Edit user',
        action: `/users/${id}/edit`,
        submitLabel: 'Save changes',
        user: this.usersService.findOne(id),
      });
    } catch (error) {
      this.renderError(response, error);
    }
  }

  @Post(':id/edit')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Res() response: Response,
  ): void {
    try {
      this.usersService.update(id, dto);
      response.redirect(`/users/${id}`);
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
      this.usersService.remove(id);
      response.redirect('/users');
    } catch (error) {
      this.renderError(response, error);
    }
  }

  private renderError(response: Response, error: unknown): void {
    if (error instanceof HttpException) {
      response.status(error.getStatus()).render('users/error', {
        statusCode: error.getStatus(),
        message: error.message,
      });
      return;
    }
    throw error;
  }
}
